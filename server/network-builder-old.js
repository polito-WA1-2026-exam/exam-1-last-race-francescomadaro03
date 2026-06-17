class StationNode {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        // Per ogni linea a cui appartiene, memorizziamo i puntatori al nodo precedente e successivo
        // map: line_id -> { prev: StationNode | null, next: StationNode | null, lineName: string }
        this.lines = {}; 
        
        // Nuovi campi per gli interscambi
        this.exchange = false;
        this.line_set = new Set(); // Set di ID o nomi delle linee che passano per questa stazione
    }
}

export const buildDoubleLinkedList = (networkEntries) => {
    // networkEntries è l'array di oggetti restituito dal DB (ordinato o meno)
    const stations = new Map(); // station_id -> StationNode

    // 1. Creiamo tutti i nodi vuoti e popoliamo i line_set
    networkEntries.forEach(entry => {
        if (!stations.has(entry.station_id)) {
            stations.set(entry.station_id, new StationNode(entry.station_id, entry.station_name));
        }
        const node = stations.get(entry.station_id);
        
        // Aggiungiamo l'ID della linea al Set delle linee
        node.line_set.add(entry.line_id);
        
        // Se c'è più di una linea, allora è uno snodo di interscambio
        if (node.line_set.size > 1) {
            node.exchange = true;
        }

        // Inizializziamo l'oggetto della linea per questa stazione
        node.lines[entry.line_id] = { 
            prev: null, 
            next: null, 
            lineName: entry.line_name,
            stopOrder: entry.stop_order 
        };
    });

    // 2. Raggruppiamo per linea e ordiniamo per stop_order
    const linesMap = {};
    networkEntries.forEach(entry => {
        if (!linesMap[entry.line_id]) {
            linesMap[entry.line_id] = [];
        }
        linesMap[entry.line_id].push(entry);
    });

    // 3. Colleghiamo i nodi (Double-Linked List)
    for (const lineId in linesMap) {
        const stops = linesMap[lineId];
        // Assicuriamoci che siano ordinati per stop_order
        stops.sort((a, b) => a.stop_order - b.stop_order);

        for (let i = 0; i < stops.length; i++) {
            const currentId = stops[i].station_id;
            const currentNode = stations.get(currentId);
            
            // Colleghiamo il nodo precedente
            if (i > 0) {
                const prevId = stops[i - 1].station_id;
                currentNode.lines[lineId].prev = stations.get(prevId);
            }
            // Colleghiamo il nodo successivo
            if (i < stops.length - 1) {
                const nextId = stops[i + 1].station_id;
                currentNode.lines[lineId].next = stations.get(nextId);
            }
        }
    }

    // Ritorniamo la mappa con tutti i nodi interconnessi
    return stations;
};

export const getShortestPath = (graph, startId, targetId) => {
    const queue = [{ id: startId, dist: 0 }];
    const visited = new Set();
    visited.add(startId);

    while(queue.length > 0) {
        const curr = queue.shift();
        if (curr.id === targetId) return curr.dist;

        const node = graph.get(curr.id);
        
        // I vicini sono prev e next su ogni linea a cui il nodo appartiene
        for (const lineId of node.line_set) {
            const lineData = node.lines[lineId];
            if (lineData.next && !visited.has(lineData.next.id)) {
                visited.add(lineData.next.id);
                queue.push({ id: lineData.next.id, dist: curr.dist + 1 });
            }
            if (lineData.prev && !visited.has(lineData.prev.id)) {
                visited.add(lineData.prev.id);
                queue.push({ id: lineData.prev.id, dist: curr.dist + 1 });
            }
        }
    }
    return -1; // Se non raggiungibile
};

export const generateRoute = (graph) => {
    const stationIds = Array.from(graph.keys());
    let valid = false;
    let startNode, endNode;

    while (!valid) {
        // 1. Scegli partenza casuale
        const startId = stationIds[Math.floor(Math.random() * stationIds.length)];
        startNode = graph.get(startId);
        
        let currentNode = startNode;
        // Scegli linea iniziale a caso tra quelle del nodo
        const initialLines = Array.from(currentNode.line_set);
        let currentLineId = initialLines[Math.floor(Math.random() * initialLines.length)];
        
        // Parametri casuali
        let totalSteps = Math.floor(Math.random() * 5) + 4; // Da 4 a 8 passi (per sicurezza > 3)
        let interchangesLeft = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3 interscambi
        
        let explored = new Set();
        explored.add(currentNode.id);
        
        // Direzione: 'next' o 'prev'
        let direction = Math.random() < 0.5 ? 'next' : 'prev';
        let aborted = false;

        while (totalSteps > 0 && !aborted) {
            const nextNode = currentNode.lines[currentLineId][direction];
            
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
                const otherLines = Array.from(currentNode.line_set).filter(lid => lid !== currentLineId);
                if (otherLines.length > 0) {
                    currentLineId = otherLines[Math.floor(Math.random() * otherLines.length)];
                    interchangesLeft--;
                    direction = Math.random() < 0.5 ? 'next' : 'prev'; // Nuova direzione casuale
                }
            }
        }

        // Se non abbiamo abortito per loop, controlliamo la distanza minima
        if (!aborted && currentNode.id !== startNode.id) {
            endNode = currentNode;
            const dist = getShortestPath(graph, startNode.id, endNode.id);
            if (dist >= 3) {
                valid = true;
            }
        }
    }
    
    return {
        start: { id: startNode.id, name: startNode.name },
        end: { id: endNode.id, name: endNode.name },
        minDistance: getShortestPath(graph, startNode.id, endNode.id)
    };
};

export const validateSubmittedRoute = (graph, segments, assignedStartId, assignedEndId) => {
    // 1. Basic check: Do assigned stations exist?
    if (!graph.has(assignedStartId) || !graph.has(assignedEndId)) {
        return { isValid: false, error: "Assigned stations do not exist in the network." };
    }

    if (!segments || segments.length === 0) {
        return { isValid: false, error: "No route provided." };
    }

    let isForward = true;

    // 2. Start and End checks
    if (segments[0].startId === assignedStartId && segments[segments.length - 1].endId === assignedEndId) {
        isForward = true;
    } else if (segments[0].startId === assignedEndId && segments[segments.length - 1].endId === assignedStartId) {
        isForward = false;
    } else {
        return { isValid: false, error: "The route does not start and end at the assigned stations." };
    }

    const usedSegments = new Set();
    let currentStationId = isForward ? assignedStartId : assignedEndId;

    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        
        // 3. Continuity check
        if (seg.startId !== currentStationId) {
            return { isValid: false, error: `Route discontinuity at segment ${i+1}: expected to start from station ${currentStationId}.` };
        }

        const currentNode = graph.get(seg.startId);
        const nextNode = graph.get(seg.endId);

        if (!currentNode || !nextNode) {
            return { isValid: false, error: `Invalid station ID at segment ${i+1}.` };
        }

        // 4. Double-Linked List adjacency check
        let validAdjacency = false;
        
        // Search through all lines passing through the current node
        const linesToCheck = Array.from(currentNode.line_set);

        for (const lineId of linesToCheck) {
            if (currentNode.lines[lineId]) {
                const prevNode = currentNode.lines[lineId].prev;
                const nextNodeOnLine = currentNode.lines[lineId].next;
                
                if ((prevNode && prevNode.id === seg.endId) || (nextNodeOnLine && nextNodeOnLine.id === seg.endId)) {
                    validAdjacency = true;
                    break;
                }
            }
        }

        if (!validAdjacency) {
            return { isValid: false, error: `Stations ${seg.startId} and ${seg.endId} are not adjacent.` };
        }

        // 5. Duplicate segment check
        const minId = Math.min(seg.startId, seg.endId);
        const maxId = Math.max(seg.startId, seg.endId);
        const sig = `${minId}-${maxId}`;

        if (usedSegments.has(sig)) {
            return { isValid: false, error: `Duplicate segment: the path ${seg.startId}-${seg.endId} has been traversed more than once.` };
        }
        usedSegments.add(sig);

        // Move to the next node
        currentStationId = seg.endId;
    }

    return { isValid: true, error: null };
};

/**
 * Generates an array of random events based on their weights.
 * @param {Array} eventsList - Array of event objects from the DB (must have 'weight' property).
 * @param {number} numSegments - Number of segments for which to generate events.
 * @returns {Array} - Array of selected event objects.
 */
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
