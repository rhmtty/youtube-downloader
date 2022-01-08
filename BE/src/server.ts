import { config } from "dotenv";
config();
import http from "http";
import express, { Request, Response } from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import { SocketInit } from "./socket.io";
import { downloadsRouter } from "./routes/downloads.routes";

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: 'https://yotube-downloader.netlify.app',
        methods: ['GET', 'POST', 'DELETE']
    },
});

new SocketInit(io);

mongoose
    .connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch((error) => {
        throw error;
    });

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));
app.use(cors());
app.use(downloadsRouter);

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,multipart/form-data,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});

app.get("/", (req: Request, res: Response) => {
    res.render("index");
});

server.listen(process.env.PORT || 3000, () => {
    console.log("Server running up 3000");
});