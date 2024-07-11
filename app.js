const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const expressSession = require("express-session");
const flash = require("connect-flash");


const db = require("./config/mongoose-connection");

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");

require('dotenv').config();

// ... other imports and middleware setup ...

app.use(
    expressSession({
        secret: process.env.SESSION_SECRET || "emergency-secret",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());
app.use('/', indexRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);


app.listen(3000);
