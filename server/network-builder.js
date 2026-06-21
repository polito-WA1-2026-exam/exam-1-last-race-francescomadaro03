import { start } from "node:repl";

class StationNode {
    constructor(id, name, lat, lng) {
        this.id = Number(id);
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        // Per ogni linea a cui appartiene, memorizziamo i puntatori al nodo precedente e successivo
        // map: line_id -> { prev: StationNode | null, next: StationNode | null, lineName: string }
        this.lines = new Map();
        // Nuovi campi per gli interscambi
        this.exchange = false;
        this.line_set = new Set(); // Set di ID o nomi delle linee che passano per questa stazione

    }
}

class Line {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.stops = [];
    }

    getNextStop(stationId) {
        const index = this.stops.findIndex(s => s.id === stationId);
        if (index !== -1 && index < this.stops.length - 1) return this.stops[index + 1];
        return null;
    }

    getPrevStop(stationId) {
        const index = this.stops.findIndex(s => s.id === stationId);
        if (index > 0) return this.stops[index - 1];
        return null;
    }
}

export const buildDoubleLinkedList = (networkEntries) => {
    // networkEntries è l'array di oggetti restituito dal DB (ordinato o meno)
    const stations = new Map(); // station_id -> StationNode

    // 1. Creiamo tutti i nodi vuoti e popoliamo i line_set
    networkEntries.forEach(entry => {
        if (!stations.has(entry.station_id)) {
            stations.set(entry.station_id, new StationNode(entry.station_id, entry.station_name, entry.lat, entry.lng));
        }
        const node = stations.get(entry.station_id);

        // Aggiungiamo l'ID della linea al Set delle linee
        node.line_set.add(entry.line_id);

        // Se c'è più di una linea, allora è uno snodo di interscambio
        if (node.line_set.size > 1) {
            node.exchange = true;
        }
    });

    // 2. Raggruppiamo per linea e ordiniamo per stop_order
    const linesMap = {};
    networkEntries.forEach(entry => {
        if (!linesMap[entry.line_id]) {
            linesMap[entry.line_id] = new Line(entry.line_id, entry.line_name);
        }
        linesMap[entry.line_id].stops.push(entry);
    });

    // 3. Colleghiamo i nodi (Double-Linked List)
    for (const stringLineId in linesMap) {
        const lineId = Number(stringLineId);
        const line = linesMap[lineId];
        // Assicuriamoci che siano ordinati per stop_order
        line.stops.sort((a, b) => a.stop_order - b.stop_order);
        line.stops = line.stops.map((stop) => stations.get(stop.station_id));
        for (let i = 0; i < line.stops.length; i++) {
            const currentNode = line.stops[i];
            let prevNode = null;
            let nextNode = null;
            // Colleghiamo il nodo precedente
            if (i > 0) {
                prevNode = line.stops[i - 1];
            }
            // Colleghiamo il nodo successivo
            if (i < line.stops.length - 1) {
                nextNode = line.stops[i + 1];
            }

            currentNode.lines.set(lineId, { prev: prevNode, next: nextNode, lineName: line.name, stopOrder: i });
        }
    }

    // Ritorniamo la mappa con tutti i nodi interconnessi
    return { stations, linesMap };
};

export const getShortestPath = (stations, linesMap, startId, targetId) => {
    const queue = [{ id: startId, dist: 0 }];
    const visited = new Set();
    visited.add(startId);

    while (queue.length > 0) {
        const curr = queue.shift();
        if (curr.id === targetId) return curr.dist;

        const node = stations.get(curr.id);

        // I vicini sono prev e next su ogni linea a cui il nodo appartiene
        for (const lineId of node.line_set) {
            const line = linesMap[lineId];
            if (line) {
                const nextNode = line.getNextStop(node.id);
                const prevNode = line.getPrevStop(node.id);

                if (nextNode && !visited.has(nextNode.id)) {
                    visited.add(nextNode.id);
                    queue.push({ id: nextNode.id, dist: curr.dist + 1 });
                }
                if (prevNode && !visited.has(prevNode.id)) {
                    visited.add(prevNode.id);
                    queue.push({ id: prevNode.id, dist: curr.dist + 1 });
                }
            }
        }
    }
    return -1; // Se non raggiungibile
};

export const generateRoute = (stations, linesMap) => {
    const stationIds = [...stations.keys()];
    let valid = false;
    let startNode, endNode;

    while (!valid) {
        // 1. Scegli partenza casuale
        const startId = stationIds[Math.floor(Math.random() * stationIds.length)];

        let currentNode = stations.get(startId);
        // Scegli linea iniziale a caso tra quelle del nodo
        const initialLines = [...currentNode.line_set];
        let currentLineId = initialLines[Math.floor(Math.random() * initialLines.length)];

        // Parametri casuali
        let totalSteps = Math.floor(Math.random() * 5) + 4; // Da 4 a 8 passi (per sicurezza > 3)
        let interchangesLeft = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3 interscambi

        let explored = new Set();
        explored.add(startId);

        // Direzione: 'next' o 'prev'
        let direction = Math.random() < 0.5 ? 'next' : 'prev';
        let aborted = false;

        while (totalSteps > 0 && !aborted) {
            const lineData = currentNode.lines.get(currentLineId);
            const nextNode = direction === 'next' ? lineData.next : lineData.prev;

            if (!nextNode) {
                // Raggiunto un capolinea
                break;
            }

            if (explored.has(nextNode.id)) {
                aborted = true; // Loop individuato, abortiamo
                break;
            }

            currentNode = nextNode;
            explored.add(currentNode.id);
            totalSteps--;

            // Se siamo su uno snodo e abbiamo ancora interscambi, cambiamo linea
            if (totalSteps > 0 && currentNode.exchange && interchangesLeft > 0) {
                const otherLines = [...currentNode.line_set].filter(lid => lid !== currentLineId);
                if (otherLines.length > 0) {
                    currentLineId = otherLines[Math.floor(Math.random() * otherLines.length)];
                    interchangesLeft--;
                    direction = Math.random() < 0.5 ? 'next' : 'prev'; // Nuova direzione casuale
                }
            }
        }

        // Se non abbiamo abortito per loop, controlliamo la distanza minima
        if (!aborted && currentNode.id !== startId) {
            endNode = currentNode;
            const dist = getShortestPath(stations, linesMap, startId, endNode.id);
            if (dist >= 3) {
                startNode = stations.get(startId);
                valid = true;
            }
        }
    }

    return {
        start: { id: startNode.id, name: startNode.name, lat: startNode.lat, lng: startNode.lng },
        end: { id: endNode.id, name: endNode.name, lat: endNode.lat, lng: endNode.lng },
        minDistance: getShortestPath(stations, linesMap, startNode.id, endNode.id)
    };
};

export const validateSubmittedRoute = (stations, linesMap, segments, rawAssignedStartId, rawAssignedEndId) => {
    const assignedStartId = Number(rawAssignedStartId);
    const assignedEndId = Number(rawAssignedEndId);

    // 1. Le stazioni assegnate esistono?
    if (!stations.has(assignedStartId) || !stations.has(assignedEndId)) {
        return { isValid: false, error: "Assigned stations do not exist in the network." };
    }

    // 2. È stato fornito un percorso?
    if (!segments || segments.length === 0) {
        return { isValid: false, error: "No route provided." };
    }

    const firstSeg = segments[0];
    const firstStartId = Number(firstSeg.startId);
    const firstEndId = Number(firstSeg.endId);
    const firstLineId = Number(firstSeg.lineId);

    if (!stations.get(firstStartId) || !stations.get(firstEndId)) {
        return { isValid: false, error: "Invalid station ID in starting segment." };
    }

    let currentStation;

    if (assignedStartId === firstStartId) {
        currentStation = firstEndId;
    } else if (assignedStartId === firstEndId) {
        currentStation = firstStartId;
    } else {
        return { isValid: false, error: "The first segment does not touch the assigned starting station." };
    }

    const initialNode = stations.get(assignedStartId);
    if (initialNode.exchange) {
        if (!initialNode.line_set.has(firstLineId)) {
            return { isValid: false, error: `Invalid line at interchange ${assignedStartId}.` };
        }
        if (!isAdjacentOnSpecificLine(initialNode, currentStation, firstLineId, linesMap)) {
            return { isValid: false, error: `Stations ${firstStartId} and ${firstEndId} are not adjacent on the selected line.` };
        }
    } else {
        if (!isAdjacentOnAnyLine(initialNode, currentStation, linesMap)) {
            return { isValid: false, error: `Stations ${firstStartId} and ${firstEndId} are not adjacent on any line.` };
        }
    }

    // 4. Percorri la catena
    for (let i = 1; i < segments.length; i++) {
        const seg = segments[i];
        const segStartId = Number(seg.startId);
        const segEndId = Number(seg.endId);
        const segLineId = Number(seg.lineId);

        if (!stations.get(segStartId) || !stations.get(segEndId)) {
            return { isValid: false, error: `Invalid station ID: ${segStartId} or ${segEndId}.` };
        }

        let nextStationId;
        if (segStartId === currentStation) {
            nextStationId = segEndId;
        } else if (segEndId === currentStation) {
            nextStationId = segStartId;
        } else {
            return { isValid: false, error: `Route is not contiguous: expected segment to connect to ${currentStation}, but got ${segStartId}-${segEndId}.` };
        }

        const currentStationNode = stations.get(currentStation);

        if (currentStationNode.exchange) {
            if (!currentStationNode.line_set.has(segLineId)) {
                return { isValid: false, error: `Interchange station ${currentStation} does not have the specified line ${segLineId}.` };
            }
            if (!isAdjacentOnSpecificLine(currentStationNode, nextStationId, segLineId, linesMap)) {
                return { isValid: false, error: `Stations are not adjacent on the specified line.` };
            }
        } else {
            if (!isAdjacentOnAnyLine(currentStationNode, nextStationId, linesMap)) {
                return { isValid: false, error: `Stations are not adjacent on any line.` };
            }
        }

        currentStation = nextStationId;
    }

    if (currentStation !== assignedEndId) {
        return { isValid: false, error: "The route does not end at the assigned destination." };
    }

    return { isValid: true, error: null };
};

const isAdjacentOnSpecificLine = (node, neighborId, lineId, linesMap) => {
    const line = linesMap[lineId];
    if (!line) return false;

    const prev = line.getPrevStop(node.id);
    const next = line.getNextStop(node.id);

    if ((prev && prev.id === neighborId) || (next && next.id === neighborId)) {
        return true;
    }
    return false;
};

const isAdjacentOnAnyLine = (node, neighborId, linesMap) => {
    for (const lineId of node.line_set) {
        const line = linesMap[lineId];
        if (!line) continue;

        const prev = line.getPrevStop(node.id);
        const next = line.getNextStop(node.id);

        if ((prev && prev.id === neighborId) || (next && next.id === neighborId)) {
            return true;
        }
    }
    return false;
};


export const generateRandomEvents = (eventsList, numSegments) => {
    if (!eventsList || eventsList.length === 0) return [];

    // Calculate total weight of all events
    const totalWeight = eventsList.reduce((sum, event) => sum + event.weight, 0);
    const selectedEvents = [];

    for (let i = 0; i < numSegments; i++) {
        // Pick a random number between 0 (inclusive) and totalWeight (exclusive)
        let randomValue = Math.floor(Math.random() * totalWeight);

        // Find the event corresponding to the random value
        for (const event of eventsList) {
            randomValue -= event.weight;
            if (randomValue < 0) {
                selectedEvents.push(event);
                break;
            }
        }
    }

    return selectedEvents;
};
