import { validateSubmittedRoute } from './server/network-builder.js';

const stations = new Map();
stations.set(1, {id: 1, name: 'A', line_set: new Set([1])});
stations.set(2, {id: 2, name: 'B', line_set: new Set([1])});
stations.set(3, {id: 3, name: 'C', line_set: new Set([1])});
stations.set(4, {id: 4, name: 'D', line_set: new Set([1])});

const linesMap = {
    1: {
        getPrevStop: (id) => id > 1 ? {id: id - 1} : null,
        getNextStop: (id) => id < 4 ? {id: id + 1} : null
    }
};

const segmentsLR = [
    { startId: 1, endId: 2 },
    { startId: 2, endId: 3 },
    { startId: 3, endId: 4 }
];

const segmentsRL = [
    { startId: 4, endId: 3 },
    { startId: 3, endId: 2 },
    { startId: 2, endId: 1 }
];

// Mixed orientations but ordered correctly
const segmentsMixed = [
    { startId: 2, endId: 1 },
    { startId: 2, endId: 3 },
    { startId: 4, endId: 3 }
];

console.log("LR (1 to 4):", validateSubmittedRoute(stations, linesMap, segmentsLR, 1, 4));
console.log("RL (4 to 1):", validateSubmittedRoute(stations, linesMap, segmentsRL, 4, 1));
console.log("Mixed (1 to 4):", validateSubmittedRoute(stations, linesMap, segmentsMixed, 1, 4));
console.log("Mixed (4 to 1):", validateSubmittedRoute(stations, linesMap, segmentsMixed, 4, 1));
