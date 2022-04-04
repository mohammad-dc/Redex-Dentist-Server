import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";
import toobusyJs from "toobusy-js";
import cors from "cors";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import mongoose from "mongoose";
import compression from "compression";
//configs
import config from "./config/config.config";
//routes
import { authRouter } from "./routes/auth.route";

//connect MongoDB
mongoose.connect(config.mongo.url, config.mongo.options);
const db = mongoose.connection;
db.once("error", (error) => {
  console.error(error);
});
db.on("open", () => {
  console.info("Mongo Connected");
});

// app
export const app = express();
// mongodB session store
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: config.mongo.url,
  collection: "sessions",
});

app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json({ limit: 30000 }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "localhost",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

//routes
app.use("/api/v1/auth/", authRouter);

try {
  app.listen(config.server.port, () =>
    console.log(`app is running up on port = ${config.server.port}`)
  );
} catch (error) {
  throw error;
}
