const express = require('express');
const router = express.Router();
var distance = require('google-distance-matrix');
var fareCalculator = require('../utils/fareCalculator');
const auth = require('../middleware/auth');


//distance.key(process.env.GOOGLE_API_KEY);
distance.key('AIzaSyBv_3P3yNTVYWvi3fdSENaTV-jJ1XzWWAw');
//distance.key('AIzaSyDJpnqCPt1YUnCFns-VOegxFecDyrdnPRQ');
distance.units('metric');
distance.language('vn');
distance.mode('driving');

router.post('/',auth, async (req, res, next) => {
    try {
        const origin = req.body.origin;
        const destination = req.body.destination;

        //tính khoảng cách và chi phí
        const distances = await getDistanceMatrix(origin, destination);
        console.log(distances);

        //&& distances.rows[0].elements[0].status === 'OK'
        if (distances && distances.status === 'OK' && distances.rows[0].elements[0].status === 'OK') {
            const distanceDetails = distances.rows[0].elements[0];
            console.log(distanceDetails);

            const totalFare = fareCalculator(distanceDetails.distance.value, distanceDetails.duration.value);
            //console.log(`Total Fare: ${totalFare}`);

            res.json({
                status: true,
                data: {
                    distance: distanceDetails,
                    fare: totalFare
                }
            });
        } else {
            res.status(400).json({
                status: false,
                message: `${origin} is not reachable by land from ${destination}`,
                api_response: distances.status,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
});
//hàm gọi api gg tính khoảng cách
function getDistanceMatrix(origin, destination) {
    return new Promise((resolve, reject) => {
        distance.matrix([origin], [destination], (err, distances) => {
            if (err) {
                reject(err);
            } else {
                resolve(distances);
            }
        });
    });
}

module.exports = router;