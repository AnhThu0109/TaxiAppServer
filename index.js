const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');

app.set('port',process.env.PORT || 5000);
app.listen(app.get('port'), () =>{
    console.log(`Server is running at port ${app.get('port')}`);
});

//Body parser
let bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

app.use('/v1/customers', require('./routes/customerRouter'));

app.use('/v1/admin', require('./routes/adminRouter'));

app.use('/v1/driver', require('./routes/driverRouter'));

app.use('/v1/booking', require('./routes/bookingRouter'));

app.use('/v1/location', require('./routes/locationRouter'));

app.use('/v1/car', require('./routes/carRouter'));

app.get('/sync', (req, res) => {
    let models = require('./models');
    models.sequelize.sync()
    .then(() => {
        res.send('database sync completed')
    });
});