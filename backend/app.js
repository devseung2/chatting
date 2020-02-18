const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const redis = require('redis');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
const socket = require('socket.io');
const mongoose = require("mongoose");
const usersRouter = require("./routes/api/users");
const chatsRouter = require("./routes/api/chats");
const whispersRouter = require("./routes/api/whispers");
var app = express();

// redis
app.use(
  session({
    key: 'app.sid',
    secret: 'session-secret',
    store: new redisStore({
      host: '127.0.0.1',
      port: 6379,
      client: redisClient,
      prefix: 'session:',
      db: 0
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { path: '/', maxAge: 1800000 }
  })
);


// Mongo DB setup
mongoose.connect("mongodb://localhost:27017/chatting", {
  useNewUrlParser: true,
  useFindAndModify: false
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("DB connected!!!");
});

// view engine setup
https: app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/users", usersRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/whispers", whispersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// 채팅 관련
const server = require('http').createServer(app);
const io = socket.listen(server);
server.listen(3001, "127.0.0.1");

// 접속자 리스트
const userList = [];

io.on('connection', (socket) => {
  let userId = "";
  
  // 접속해제
  socket.on('disconnect', () => {
    socket.leave(userId);
    // 유저 목록에서 삭제
    for(let i in userList) {
      if(userList[i].id == userId || userList[i].id == "") {
        userList.splice(i, 1);
      }
    }
    io.emit('receiveUserList', userList);
  });
  
  // 사용자 목록 얻기(전체 채널)
  socket.on('channel', (id) => {
    userId = id;
    let userCheck = false;
    // 유저 목록에서 존재하는 유저이면 삭제
    for(let i in userList) {
      if(userList[i].id == userId) {
        userList.splice(i, 1);
        userList.push({id : id, socket_id : socket.id});
        socket.leave(userId);
        socket.join(userId);
        userCheck = true;
      }
      else if(userList[i].id == ""){
        userList.splice(i, 1);
      }
    }

    if(!userCheck){
      socket.join(userId);
      userList.push({id : id, socket_id : socket.id});
    }

    io.emit('receiveUserList', userList);
  });
  
  // 메시지 전송(전체 채널)
  socket.on('send', (sendInfo) => {
    io.emit('receive', sendInfo);
  });
  
  // 귓속말 전송(개인 채널)
  socket.on('whisperSend', (sendInfo) => {
    if(sendInfo.id != sendInfo.channel){
      io.to(sendInfo.channel).emit('receive', sendInfo);
    }
    socket.emit('receive', sendInfo);
  });
});

module.exports = app;