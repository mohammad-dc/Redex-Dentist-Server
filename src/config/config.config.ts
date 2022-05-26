import dotenv from "dotenv";

dotenv.config();

const MONGO_OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  // useFindAndModify: false,
  socketTimeoutMS: 100000,
  keepAlive: true,
  // poolSize: 50,
  autoIndex: false,
  retryWrites: false,
};

// server info
const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
// const ORIGIN_URL = process.env.ORIGIN_URL;
// const HOST = process.env.HOST;

//twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_SERVICE_SID = process.env.TWILIO_SERVICE_SID;

//AWS
const AWS_PLATFORM_BUCKET_NAME = process.env.AWS_PLATFORM_BUCKET_NAME;
const AWS_PLATFORM_BUCKET_REGION = process.env.AWS_PLATFORM_BUCKET_REGION;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

//mongo connection info
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST;

// jwt
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
const JWT_ADMIN_ISSUER = process.env.JWT_ADMIN_ISSUER;

//jwt admin
// const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;
// const JWT_ISSUER_ADMIN = process.env.JWT_ISSUER_ADMIN;

// Pusher
const PUSHER_APP_ID = process.env.PUSHER_APP_ID;
const PUSHER_KEY = process.env.PUSHER_KEY;
const PUSHER_SECRET = process.env.PUSHER_SECRET;
const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER;

const AWS = {
  bucket: {
    name: AWS_PLATFORM_BUCKET_NAME,
    region: AWS_PLATFORM_BUCKET_REGION,
    access_key: AWS_ACCESS_KEY,
    secret_key: AWS_SECRET_KEY,
  },
};

const MONGO = {
  host: MONGO_HOST,
  password: MONGO_PASSWORD,
  username: MONGO_USERNAME,
  options: MONGO_OPTIONS,
  url: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`,
};

const PUSHER = {
  app_id: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER,
};

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

const TWILIO = {
  account_sid: TWILIO_ACCOUNT_SID,
  auth_token: TWILIO_AUTH_TOKEN,
  service_sid: TWILIO_SERVICE_SID,
};

const JWT = {
  user: {
    secret: JWT_SECRET,
    issuer: JWT_ISSUER,
  },
  admin: {
    secret: JWT_ADMIN_SECRET,
    issuer: JWT_ADMIN_ISSUER,
  },
};

const config = {
  mongo: MONGO,
  server: SERVER,
  jwt: JWT,
  twilio: TWILIO,
  pusher: PUSHER,
  aws: AWS,
};

export default config;
