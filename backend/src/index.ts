import { WebSocketServer } from "ws";
import { UserManager } from "./userManager";
import express from 'express';
import multer from 'multer';
import { supabase } from "./config/supabaseConfig";
const wss = new WebSocketServer({ port: 8080 });


const manager = UserManager.getInstance();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

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
                    upsert: true, // Overwrites if file exists
                });

            if (error) {
                return res.status(500).json({ message: "Upload failed", error });
            }

            // Generate a public URL (if bucket is public) OR signed URL (if private)
            const { data: publicUrlData, error: urlError } = await supabase.storage.from(process.env.SUPABASE_BUCKET || "chatrandombucket").createSignedUrl(fileName, 86400);

            if (urlError) {
                return res.status(500).json({ message: "Failed to generate signed URL", error: urlError });
            }
            res.json({ fileUrl: publicUrlData.signedUrl });
        } catch (err) {
            res.status(500).json({ message: "An unexpected error occurred", error: err });
        }
    })();
});


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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening at PORT ${PORT}`);
});

