import { createClient, RedisClientType } from "redis";
import { WebSocket } from "ws";
import { v4 as uuid } from "uuid";

const roomSubscriptions = new Map<string, WebSocket[]>();

export class UserManager {
    private static instance: UserManager;
    private redisClient: RedisClientType; // Regular commands client
    private redisSubClient: RedisClientType; // Subscriber client

    private constructor() {
        // Regular Redis client for commands
        this.redisClient = createClient();
        this.redisClient.connect().catch(console.error);

        // Separate client for subscriptions
        this.redisSubClient = this.redisClient.duplicate();
        this.redisSubClient.connect().catch(console.error);
    }

    public static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    public async userConnect(ws: WebSocket, userId: string) {
        try {
            ws.send(JSON.stringify({
                type: "USER_ID",
                userId: userId
            }));
            // Use regular client for transactions
            await this.redisClient.watch("pendingRooms");
            const pendingRoom = await this.redisClient.lIndex("pendingRooms", 0);

            if (!pendingRoom) {
                const newRoomId = `room:${uuid()}`;
                const multi = this.redisClient.multi();
                multi.rPush("pendingRooms", JSON.stringify({ userId, roomId: newRoomId }));
                await multi.exec();

                this.subscribeToRoom(newRoomId, ws);
                this.setupMessageHandler(ws, newRoomId);
                this.setupDisconnectionHandling(ws, newRoomId);
            } else {
                const multi = this.redisClient.multi();
                multi.lPop("pendingRooms");
                await multi.exec();
                const { roomId } = JSON.parse(pendingRoom);

                this.subscribeToRoom(roomId, ws);
                this.setupMessageHandler(ws, roomId);
                
                // Use regular client for publishing
                this.redisClient.publish(
                    roomId,
                    JSON.stringify({
                        type: "PAIR_CONNECTED",
                        message: "A peer has joined the room!"
                    })
                );

                this.setupDisconnectionHandling(ws, roomId);
            }
        } catch (error) {
            console.error("Connection error:", error);
            ws.close(1008, "Connection failed");
        }
    }

    private subscribeToRoom(roomId: string, ws: WebSocket) {
        
        if (!roomSubscriptions.has(roomId)) {
            roomSubscriptions.set(roomId, []);
            // Use separate subscriber client
            this.redisSubClient.subscribe(roomId, (message) => {
                const subscribers = roomSubscriptions.get(roomId) || [];
                subscribers.forEach(subscriber => {
                    if (subscriber.readyState === WebSocket.OPEN) {
                        subscriber.send(message);
                    }
                });
            });
        }
        roomSubscriptions.get(roomId)!.push(ws);
    }

    private setupMessageHandler(ws: WebSocket, roomId: string) {
        ws.on('message', (data) => {
            if (roomId) {
                // Use regular client for publishing
                this.redisClient.publish(roomId, data.toString());
            }
        });
    }

    private setupDisconnectionHandling(ws: WebSocket, roomId: string) {
        const cleanup = () => {
            if (!roomId) return;
            this.redisClient.publish(
                roomId,
                JSON.stringify({
                    type: "PAIR_DISCONNECTED",
                    message: "Peer has left the room"
                })
            );
            const subscribers = roomSubscriptions.get(roomId) || [];
            roomSubscriptions.set(roomId, subscribers.filter(s => s !== ws));

            if (roomSubscriptions.get(roomId)?.length === 0) {
                this.redisSubClient.unsubscribe(roomId);
                roomSubscriptions.delete(roomId);
            }
        };

        ws.on('close', cleanup);
        ws.on('error', cleanup);
    }
}