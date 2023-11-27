const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');
//var socket_io = require("socket.io");
//var io = socket_io();
var path = require("path");

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { handleDriverConnection } = require('./socket/server');

io.on('connection', (socket) => {
    handleDriverConnection(socket)
});

server.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`);
  });
// Enable All CORS Requests
app.use(cors()); 

app.use((req, res, next) => {
    req.io = io;
    next();
  });
//views

app.set("views",  path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);


//Body parser
let bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

app.use("/", require('./routes/index'));
app.use('/v1/customers', require('./routes/customerRouter'));

app.use('/v1/admin', require('./routes/adminRouter'));

app.use('/v1/driver', require('./routes/driverRouter'));

app.use('/v1/booking', require('./routes/bookingRouter'));

app.use('/v1/location', require('./routes/locationRouter'));

app.use('/v1/car', require('./routes/carRouter'));

app.use('/v1/cartypes', require('./routes/cartypeRouter'));

app.use('/v1/services', require('./routes/serviceRouter'));

app.use('/v1/distance', require('./routes/distanceRouter'));

app.use('/v1/driverLocation/', require('./routes/driverLocationRouter'));


app.get('/sync', (req, res) => {
    let models = require('./models');
    models.sequelize.sync()
    .then(() => {
        res.send('database sync completed')
    });
});


app.set('port',process.env.PORT || 5000);

io.listen(app.listen(app.get('port'), () =>{
    console.log(`Server is running at port ${app.get('port')}`);
}))
app.io = io.on("connection", function(socket){
	console.log("Socket connected: " + socket.id);
});