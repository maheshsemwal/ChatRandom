import { WebSocketServer } from "ws";
import { UserManager } from "./userManager";
import express from 'express';
import multer from 'multer';
import { supabase } from "./config/supabaseConfig";
import dotenv from "dotenv";
import http from 'http';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))


const upload = multer({ storage: multer.memoryStorage() });
const server = http.createServer(app); // ✅ Shared HTTP server
const wss = new WebSocketServer({ server }); // ✅ Attach WebSocket to same server

const manager = UserManager.getInstance();

app.use(express.json());

app.post("/api/image-upload", upload.single("image"), (req, res) => {
    (async () => {
        try {
            console.log("Received file:", req.file);

            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const fileName = `${Date.now()}-${req.file.originalname}`;
            const { data, error } = await supabase.storage
                .from(process.env.SUPABASE_BUCKET || "chatrandombucket")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true,
                });

            if (error) {
                return res.status(500).json({ message: "Upload failed", error });
            }

            const { data: publicUrlData, error: urlError } = await supabase.storage
                .from(process.env.SUPABASE_BUCKET || "chatrandombucket")
                .createSignedUrl(fileName, 86400);

            if (urlError) {
                return res.status(500).json({ message: "Failed to generate signed URL", error: urlError });
            }

            res.json({ fileUrl: publicUrlData.signedUrl });
        } catch (err) {
            res.status(500).json({ message: "An unexpected error occurred", error: err });
        }
    })();
});

// ✅ Handle WebSocket connections
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message: string) {
        try {
            const data = JSON.parse(message);
            const { userId, userName } = data.user;

            console.log("Received message:", data);

            if (data.type === 'CONNECT') {
                manager.userConnect(ws, userId, userName);
            }
        } catch (err) {
            console.error("Invalid JSON received:", message);
        }
    });
});

// ✅ Start server on Render-exposed port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server (HTTP + WS) is running on port ${PORT}`);
});
