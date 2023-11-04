//const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let models = require('../models');
let Admin = models.Admin;


const adminController = {
    register: async (req, res) => {
        try {
            const { username, password, fullname, phoneNo, gender, avatarPath } = req.body;
            console.log(req.body);
            
            if (!username || !password || !fullname) {
                res.status(400).send('Username or password is missing')
                return;
            }
            else {
                const admin = await Admin.findOne({ 
                    where: { username : username}
                 });
                                            
                                            
                //console.log(user);
                if (admin) {
                    res.status(400).send('Username already exists')
                    return;
                }
                else {
                    const passwordHash = await bcrypt.hash(password, 10);
                   //ghi dữ liệu customer xuống db
                   console.log(username,passwordHash,fullname,phoneNo,gender,avatarPath);
                    /*await Admin.create({
                        username: username,
                        password: passwordHash,
                        fullname: fullname,
                        phoneNo: phoneNo,
                        gender: gender,
                        avatarPath: avatarPath
                    });*/
                    const newAdmin = Admin.build({
                        username: username,
                        password: passwordHash,
                        fullname: fullname,
                        phoneNo: phoneNo,
                        gender: gender,
                        avatarPath: avatarPath
                    })
                    console.log(newAdmin);
                    await newAdmin.save();
                    const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
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
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send('Username or password is missing')
            return;
        }
        const admin = await Admin.findOne({ 
            where: { username : username}
         })
        if (!admin) {
            res.status(404).send('Username not found')
            return;
        }
        else {
            let isCorret = await bcrypt.compare(password, admin.password)
            if (!isCorret) {
                res.status(400).send({
                    status: 400,
                    message: 'Tên người dùng hoặc mật khẩu không đúng.'
                })
                return;
            }
            const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
            res.send({ 
                status: 200,
                message: 'Đăng nhập thành công!',
                data: {
                    id: admin.id,
                    username: username,
                    phonenumber: admin.phoneNo
                },
                token: token 
            });
        }
    },
}
module.exports = adminController