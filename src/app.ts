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
import { citiesRouter } from "./routes/cities.route";
import { notificationsRouter } from "./routes/notifications.route";
import { usersRouter } from "./routes/users.route";
import { reservationsRouter } from "./routes/reservations.route";
import { reportReasonsRouter } from "./routes/reportReasons.route";
import { reportsRouter } from "./routes/reports.route";
import { adminRouter } from "./routes/admin.route";
import { chatRouter } from "./routes/chat.route";
import { reviewsRouter } from "./routes/reviews.route";

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
// mongodB session storeredexDintistdb
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
app.use("/api/v1/admin/", adminRouter);
app.use("/api/v1/:lang/auth/", authRouter);
app.use("/api/v1/:lang/users/", usersRouter);
app.use("/api/v1/:lang/cities/", citiesRouter);
app.use("/api/v1/:lang/reviews", reviewsRouter);
app.use("/api/v1/:lang/reports/", reportsRouter);
app.use("/api/v1/:lang/chat/message/", chatRouter);
app.use("/api/v1/notifications/", notificationsRouter);
app.use("/api/v1/:lang/reservations/", reservationsRouter);
app.use("/api/v1/:lang/report/reasons/", reportReasonsRouter);

try {
  app.listen(config.server.port, () =>
    console.log(`app is running up on port = ${config.server.port}`)
  );
} catch (error) {
  throw error;
}
