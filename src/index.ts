import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { connect } from "./database";
import http from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { Topic } from "./models/Topic";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(routes);

io.on("connection", (socket) => {
  console.log(`Nova conexão: ${socket.id}`);

  socket.on("join_room", async ({ name, topicId }) => {
    try {
      socket.join(topicId);

      const systemMessage = {
        _id: new mongoose.Types.ObjectId(),
        content: `${name} entrou na sala`,
        createdAt: new Date()
      };

      io.to(topicId).emit("new_message", systemMessage);
    } catch (error) {
      console.error("Error on join_room:", error);
    }
  });

  socket.on("send_message", async ({ content, author, topicId }) => {
    try {
      const topic = await Topic.findById(topicId);
      if (!topic) {
        throw new Error("Topic not found");
      }

      const message = {
        _id: new mongoose.Types.ObjectId(),
        content,
        author,
        createdAt: new Date()
      };

      topic.messages.push(message);
      await topic.save();

      io.to(topicId).emit("new_message", message);
    } catch (error) {
      console.error("Error on send_message:", error);
    }
  });

  socket.on("leave_room", async ({ name, topicId }) => {
    try {
      socket.leave(topicId);

      const systemMessage = {
        _id: new mongoose.Types.ObjectId(),
        content: `${name} saiu da sala`,
        createdAt: new Date()
      };

      io.to(topicId).emit("new_message", systemMessage);
    } catch (error) {
      console.error("Error on leave_room:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} desconectou-se`);
  });
});

connect();

server.listen(3000, () => console.log("Application started on http://localhost:3000"));
