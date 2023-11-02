const express = require('express');
const app = express();

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


app.get('/sync', (req, res) => {
    let models = require('./models');
    models.sequelize.sync()
    .then(() => {
        res.send('database sync completed')
    });
});