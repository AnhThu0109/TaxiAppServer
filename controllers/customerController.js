const customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const customerController = {
    register: async (req, res) => {
        try {
            const { phoneNo, password, fullname, gender, email } = req.body;
            console.log(req.body);
            if (!phoneNo || !password || !fullname) {
                res.status(400).send('Phone number or password is missing')
                return;
            }
            else {
                const user = await customer.findOne({ phoneNo: phoneNo })
                if (user) {
                    res.status(400).send('Phone number already exists')
                    return;
                }
                else {
                    const passwordHash = await bcrypt.hash(password, 10);
                    const newUser = new customer({
                        phoneNo,
                        password: passwordHash,
                        fullname,
                        gender,
                        email
                    });
                    await newUser.save()
                    const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
                    console.log(token)
                    res.send({ token: token })
                }
            }
        }
        catch (err) {
            res.status(500).send({ message: "Internal Server" })
        }
    },
    login: async (req, res) => {
        const { phoneNo, password } = req.body;
        if (!phoneNo || !password) {
            res.status(400).send('Phone number or password is missing')
            return;
        }
        const user = await customer.findOne({ phoneNo: phoneNo })
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
            const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
            res.send({ token: token })
        }
    },
}
module.exports = customerController