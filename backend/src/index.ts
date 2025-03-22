import { WebSocketServer } from "ws";
import { UserManager } from "./userManager";
import { v4 as uuid } from "uuid";
const wss = new WebSocketServer({ port: 8080 });

const manager = UserManager.getInstance();

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message: string) {
        // Parse the message from the client
        try {
            const data = JSON.parse(message);
            const { userId, userName } = data.user;

            // Now you can pass userId and userName to userConnect
            console.log("Received message:", data);
            if(data.type === 'CONNECT')
                manager.userConnect(ws, userId, userName);
        } catch (err) {
            console.error("Invalid JSON received:", message);
        }
    });
});

