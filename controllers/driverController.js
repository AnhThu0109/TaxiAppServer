//const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let Sequelize = require('sequelize');
let Op = require('sequelize');
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
                    console.log(newDriver instanceof Driver);
                    newDriver.save().then(result => {
                        console.log(result);
                    }).catch( error => {
                        console.log(error);
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
        const driver = await Driver.findOne({ 
            where: { phoneNo : phoneNo}
         })
        if (!driver) {
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
    update: async (driver) => {
        //const { id, socketId } = req.body;
        console.log(driver.socketid)
        console.log("driver: "+JSON.stringify(driver, null, 2));
        try {
            const driverUpdate = await Driver.update({
               status: driver.status,
                socketId: driver.socketId,
                location: driver.location
            }, 
                {
                where: {
                    id: driver.id,
                },
            })
            if (!driverUpdate) {
                throw new Error('Update failed');
            }
            
        } catch (err) {
            console.error('Error updating driver:', err.message);
            throw err;
        }
    },
    NearByDrivers: async (targetLongitude, targetLatitude, carType, serviceId) => {
        try {
            const maxDistance = 1000;
            const targetPoint = Sequelize.fn(
                'ST_SetSRID',
                Sequelize.fn('ST_MakePoint', targetLongitude, targetLatitude),
                4326
              );
            
              const drivers = await Driver.findAll({
                attributes: [
                  'id', 'status', 'socketId', 'location',
                  [
                    Sequelize.literal(
                      `ST_Distance("location", ST_GeographyFromText('POINT(${targetLongitude} ${targetLatitude})')) / 1000`
                    ),
                    'distance_in_km',
                  ],
                ],
                where: Sequelize.literal(
                  `ST_DWithin("location", ST_GeographyFromText('POINT(${targetLongitude} ${targetLatitude})'), ${maxDistance * 1000}) = true AND status = 'available'`
                ),
                include: [{model: models.Car, where: {carType: carType, serviceId: serviceId}}],
                order: [[Sequelize.literal(`ST_Distance("location", ST_GeographyFromText('POINT(${targetLongitude} ${targetLatitude})'))`), 'ASC']],
              });
              //console.log("near drivers", drivers);
              return drivers;
        } catch (err) {
            console.error('Error find driver:', err.message);
            throw err;
        }
    },

    findAllDrivers: async (req, res) => {
        try {
            const drivers = await Driver.findAll();
            res.status(200).json(drivers);
        } catch (error) {
            console.error(error.message);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    },

    findDriverById: async (driverId) => {
        //const driverId = req.params.id;

        try {
            const driver = await Driver.findByPk(driverId, {
                attributes: ['id', 'phoneNo', 'fullname', 'licensePlate', 'location', 'gender', 'avatarPath', 'status', 'socketId', 'location'],
            });

            return driver;
        } catch (error) {
            console.error('Error find driver:', error.message);
            throw error;
        }
    },
}
module.exports = driverController