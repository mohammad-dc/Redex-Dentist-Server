import http from "http";
import express from "express";

const app = express();

//create server
const server = http.createServer(app);

export { app, server };
