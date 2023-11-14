
function calculateFare(serviceType, distance, duration) {
    const fareInfo = {
        'bike': {
            baseFare: 12500,
            freeDistance: 2,
            perKmRate: 4300,
            perMinuteRate: 350
        },
        'bike-plus': {
            baseFare: 16000,
            freeDistance: 2,
            perKmRate: 5300,
            perMinuteRate: 370
        },
        'car': {
            baseFare: 29000,
            freeDistance: 2,
            perKmRate: 10000,
            perMinuteRate: 450
        },
        'car-plus': {
            baseFare: 34200,
            freeDistance: 2,
            perKmRate: 12600,
            perMinuteRate: 530
        },
        'car-7seat': {
            baseFare: 34000,
            freeDistance: 2,
            perKmRate: 13000,
            perMinuteRate: 550
        }
    };

    const service = fareInfo[serviceType];

    if (!service) {
        throw new Error('Invalid service type');
    }

    const excessDistance = Math.max(0, distance - service.freeDistance);
    const fare = service.baseFare + (excessDistance * service.perKmRate) + (duration * service.perMinuteRate);

    return Math.round(fare);
}
const calculateAllFares = (distance, duration) => {
    const services = ['bike', 'bike-plus', 'car', 'car-plus', 'car-7seat'];
    distance = distance/1000;
    duration = duration/60;
    const result = services.reduce((acc, serviceType) => {
        const fare = calculateFare(serviceType, distance, duration);
        acc[serviceType] = fare;
        return acc;
    }, {});

    return result;
}


module.exports = calculateAllFares;