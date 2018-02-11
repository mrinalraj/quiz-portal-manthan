require('dotenv').config()
const express = require('express'),
    app = express(),
    PORT = 8000,
    mongoose = require('mongoose'),
    path = require('path'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    MongoStore = require('connect-mongo')(session),
    chalk = require('chalk')

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');
app.use(express.static(path.resolve(__dirname, 'public')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}))
app.use(flash())

app.get('/', (req, res) => {
    res.send("Hello")
})
const options = {
    useMongoClient: true,
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
};
mongoose.connect(process.env.MONGODB_LOCAL_URI, options)
let db = mongoose.connection

app.listen(PORT, err => {
    if (err) return console.log("error occured :", err)
    else return console.log(chalk.cyan.bold("\nServer started at " + PORT), chalk.green.bold("\nwe are now connected, hooorrey!"))
})