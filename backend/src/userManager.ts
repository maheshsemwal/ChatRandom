import { createClient, RedisClientType } from "redis";
import { WebSocket } from "ws";
import { v4 as uuid } from "uuid";
import { redisClient, redisSubClient } from "./config/redis";
const roomSubscriptions = new Map<string, WebSocket[]>();

export class UserManager {
    private static instance: UserManager;

    private constructor() {
    }

    public static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    public async userConnect(ws: WebSocket, userId: string, userName: string) {
        try {
            // Use regular client for transactions
            await redisClient.watch("pendingRooms");
            const pendingRoom = await redisClient.lIndex("pendingRooms", 0);
    
            if (!pendingRoom) {
                // No pending user, create new room and wait
                const newRoomId = `room:${uuid()}`;
                const multi = redisClient.multi();
                // ✅ Store userId and userName along with roomId
                multi.rPush("pendingRooms", JSON.stringify({ userId, userName, roomId: newRoomId }));
                await multi.exec();
    
                this.subscribeToRoom(newRoomId, ws);
                this.setupMessageHandler(ws, newRoomId);
                this.setupDisconnectionHandling(ws, newRoomId);
    
                console.log(`[WAITING] User ${userName} waiting in ${newRoomId}`);
            } else {
                // Pair with the pending user
                const multi = redisClient.multi();
                multi.lPop("pendingRooms");
                await multi.exec();
    
                // ✅ Extract the pending user's info
                const { roomId, userId: pendingUserId, userName: pendingUserName } = JSON.parse(pendingRoom);
    
                this.subscribeToRoom(roomId, ws);
                this.setupMessageHandler(ws, roomId);
    
                // ✅ Notify both users with the correct pending user info
                console.log(`[PAIRING] ${userName} pairing with ${pendingUserName} in ${roomId}`);
                redisClient.publish(
                    roomId,
                    JSON.stringify({
                        type: "PAIR_CONNECTED",
                        users: [userName, pendingUserName],
                        message: `you are connected to Room`
                    })
                );
    
                this.setupDisconnectionHandling(ws, roomId);
    
                console.log(`[PAIRED] ${userName} paired with ${pendingUserName} in ${roomId}`);
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
            redisSubClient.subscribe(roomId, (message) => {
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
                redisClient.publish(roomId, data.toString());
            }
        });
    }

    private setupDisconnectionHandling(ws: WebSocket, roomId: string) {
        const cleanup = () => {
            if (!roomId) return;
            redisClient.publish(
                roomId,
                JSON.stringify({
                    type: "PAIR_DISCONNECTED",
                    message: "Peer has left the room"
                })
            );
            const subscribers = roomSubscriptions.get(roomId) || [];
            roomSubscriptions.set(roomId, subscribers.filter(s => s !== ws));

            if (roomSubscriptions.get(roomId)?.length === 0) {
                redisSubClient.unsubscribe(roomId);
                roomSubscriptions.delete(roomId);
            }
        };

        ws.on('close', cleanup);
        ws.on('error', cleanup);
    }
}