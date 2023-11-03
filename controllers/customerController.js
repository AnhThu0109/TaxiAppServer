//const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let models = require('../models');
let Customer = models.Customer;


const customerController = {
    register: async (req, res) => {
        try {
            const { phoneNo, password, fullname, gender, email, avatarPath } = req.body;
            console.log(req.body);
            
            if (!phoneNo || !password || !fullname) {
                res.status(400).send('Phone number or password is missing')
                return;
            }
            else {
                const user = await Customer.findOne({ 
                    where: { phoneNo : phoneNo}
                 });
                                            
                                            
                //console.log(user);
                if (user) {
                    res.status(400).send('Phone number already exists')
                    return;
                }
                else {
                    const passwordHash = await bcrypt.hash(password, 10);
                   //ghi dữ liệu customer xuống db
                    await Customer.create({
                        phoneNo: phoneNo,
                        password: passwordHash,
                        fullname: fullname,
                        gender: gender,
                        email: email,
                        avatarPath: avatarPath
                    });
                    const token = jwt.sign(phoneNo, process.env.ACCESS_TOKEN_SECRET);
                    console.log(token)
                    res.send({ 
                        msg: 'Register successful',
                        token: token })
                }
            }
        }
        catch (err) {
            res.status(500).send({ message: "Internal Server" })
            console.log(err.message);
        }
    },
    login: async (req, res) => {
        const { phoneNo, password } = req.body;
        if (!phoneNo || !password) {
            res.status(400).send('Phone number or password is missing')
            return;
        }
        const user = await Customer.findOne({ 
            where: { phoneNo : phoneNo}
         })
        if (!user) {
            res.status(404).send('Phone number not found')
            return;
        }
        else {
            let isCorret = await bcrypt.compare(password, user.password)
            if (!isCorret) {
                res.status(400).send('Incorrect password')
                return;
            }
            const token = jwt.sign(phoneNo, process.env.ACCESS_TOKEN_SECRET);
            res.send({ 
                msg: 'Login successful',
                token: token 
            });
        }
    },
}
module.exports = customerController