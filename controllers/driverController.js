//const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let models = require('../models');
let Driver = models.Driver;


const driverController = {
    register: async (req, res) => {
        try {
            const { phoneNo, password, fullname, email, gender, avatarPath, licensePlate } = req.body;
            console.log(req.body);
            
            if (!phoneNo) {
                res.status(400).send('Phone number is missing')
                return;
            }
            if (!password || !fullname) {
                res.status(400).send('Password is missing')
                return;
            }
            if (!fullname) {
                res.status(400).send('Fullname is missing')
                return;
            }
            if (!licensePlate) {
                res.status(400).send('License plate is missing')
                return;
            }
            else {
                const driver = await Driver.findOne({ 
                    where: [{ phoneNo : phoneNo}, {licensePlate: licensePlate}]
                 });
                                            
                                            
                //console.log(user);
                if (driver) {
                    res.status(400).send('Phone number or License plate already exists')
                    return;
                }
                else {
                    const passwordHash = await bcrypt.hash(password, 10);
                   //ghi dữ liệu customer xuống db
                   //console.log(username,passwordHash,fullname,phoneNo,gender,avatarPath);
                    /*await Driver.create({
                        phoneNo: phoneNo,
                        password: passwordHash,
                        fullname: fullname,
                        email: email,
                        gender: gender,
                        avatarPath: avatarPath,
                        licensePlate: licensePlate
                    });*/
                    
                    const newDriver = new Driver({
                        phoneNo: phoneNo,
                        password: passwordHash,
                        fullname: fullname,
                        email: email,
                        gender: gender,
                        avatarPath: avatarPath,
                        licensePlate: licensePlate
                    })
                    console.log(newDriver);
                    await newDriver.save();
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
        const driver = await Driver.findOne({ 
            where: { phoneNo : phoneNo}
         })
        if (!admin) {
            res.status(404).send('Phone number not found')
            return;
        }
        else {
            let isCorret = await bcrypt.compare(password, driver.password)
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
module.exports = driverController