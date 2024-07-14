const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')("development:mongoose");

mongoose.connect(`${config.get("MONGODB_URI")}/scatch`)
    .then(() => {
        debug("Connected to MongoDB");
    })
    .catch((err) => {
        debug("MongoDB connection error:", err);
    });

module.exports = mongoose.connection;