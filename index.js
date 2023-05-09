const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
// var cookieParser = require("cookie-parser");
// var bodyParser = require("body-parser");

var session = require("express-session");
var { createClient } = require("redis");
let RedisStore = require("connect-redis").default;

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_PORT,
  REDIS_URL,
  SESSION_SECRET,
} = require("./config/config");

// Initialize client.
let redisClient = createClient({
  legacyMode: false,
  // url: `redis://redis:6379`,
  socket: {
    port: REDIS_PORT,
    host: REDIS_URL,
  },
});
redisClient.on("connect", () => console.log("Connected to Redis!"));
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect().catch(console.error);

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// "mongodb://username(as in composeFile):password(as in composeFile)@172.28.0.2:27017/?authSource=admin"
// instaed of looking up for IP through inspect, then adding here (as IP may change in future build,
// lets reference the service (as DNS is available builtIn in docker to communicate between containers), mongo service name is named "mongo" in compose file),
//  mongoose.connect("mongodb://root:root@172.28.0.2:27017/?authSource=admin")
// mongoose.connect("mongodb://root:root@mongo:27017/?authSource=admin")

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error", err));

app.use(express.json());
app.use(cors());
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));

app.enable("trust proxy"); //for nginx
app.use(
  session({
    // Initialize store.
    store: new RedisStore({
      client: redisClient,
    }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      //   resave: false,
      //   saveUninitialized: false,
      httpOnly: false,
      maxAge: 30000,
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.send("<h2>Hi there mongo </h2>");
});

// localhost:3000/posts
app.use("/posts", postRouter);
app.use("/users", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`litening on port ${port}`));
