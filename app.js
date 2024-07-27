const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const flash = require("connect-flash");
const app = express();

require('dotenv').config();

const db = require("./config/mongoose-connection");

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(
    expressSession({
        secret: process.env.SESSION_SECRET || "emergency-secret",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());

app.use('/', indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket 
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = require('socket.io')(server); // where `server` is your HTTP server


app.use(express.static('public')); // Serve static files from 'public' directory

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        io.emit('message', msg); // Broadcast message to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(8000, () => {
    console.log('Server running on port 8000');
});
