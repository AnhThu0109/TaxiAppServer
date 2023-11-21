//const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let models = require('../models');
let Admin = models.Admin;


const adminController = {
    register: async (req, res) => {
        try {
            const { username, password, fullname, phoneNo, gender, avatarPath, address, birthday } = req.body;
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
                   console.log(username,passwordHash,fullname,phoneNo,gender,avatarPath, address, birthday);
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
                        avatarPath: avatarPath,
                        address,
                        birthday
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
    getAdminById: async (req, res) => {
        try {
            const adminId = req.params.adminId;

            // Find admin by ID in the database
            const admin = await Admin.findByPk(adminId);

            if (!admin) {
                res.status(404).send('Admin not found');
                return;
            }

            const adminData = {
                id: admin.id,
                username: admin.username,
                fullname: admin.fullname,
                phoneNo: admin.phoneNo,
                gender: admin.gender,
                avatarPath: admin.avatarPath,
                address: admin.address, 
                birthday: admin.birthday
            };

            res.status(200).json(adminData);
        } catch (err) {
            console.error(err.message);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    },
    updateAdmin: async (req, res) => {
        try {
            const adminId = req.params.adminId;
            const { fullname, phoneNo, gender, avatarPath, address, birthday } = req.body;

            // Find admin by ID in the database
            const admin = await Admin.findByPk(adminId);

            if (!admin) {
                res.status(404).send('Admin not found');
                return;
            }

            // Update admin information
            admin.fullname = fullname || admin.fullname;
            admin.phoneNo = phoneNo || admin.phoneNo;
            admin.gender = gender || admin.gender;
            admin.avatarPath = avatarPath || admin.avatarPath;
            admin.address = address || admin.address;
            admin.birthday = birthday || admin.birthday;

            // Save the updated admin information to the database
            await admin.save();

            const updatedAdminData = {
                id: admin.id,
                username: admin.username,
                fullname: admin.fullname,
                phoneNo: admin.phoneNo,
                gender: admin.gender,
                avatarPath: admin.avatarPath,
                address: admin.address,
                birthday: admin.birthday
            };

            res.status(200).json({ message: 'Admin information updated successfully', data: updatedAdminData });
        } catch (err) {
            console.error(err.message);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    },
}
module.exports = adminController