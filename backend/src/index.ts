import { WebSocketServer } from "ws";
import { UserManager } from "./userManager";
import { v4 as uuid } from "uuid";
const wss = new WebSocketServer({ port: 8080 });

const manager = UserManager.getInstance();

wss.on('connection', function connection(ws) {
    manager.userConnect(ws, uuid());
});

