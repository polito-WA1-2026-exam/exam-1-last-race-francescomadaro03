
export const bounds = {
    northWest: { lat: 51.5350, lng: -0.1950 },
    northEast: { lat: 51.5350, lng: -0.0650 },
    southWest: { lat: 51.4900, lng: -0.1950 },
    southEast: { lat: 51.4900, lng: -0.0650 }
}

export const mapCoordinatesInSpace = (lat, lng, innerWidth, innerHeight) => {

    const padding = 50;
    const minLat = bounds.southWest.lat;
    const maxLat = bounds.northWest.lat;
    const minLng = bounds.southWest.lng;
    const maxLng = bounds.southEast.lng;

    // Removed the strict bounds check so stations slightly outside still render
    // if (lat < minLat || lat > maxLat || lng < minLng || lng > maxLng) return 0;

    const width = maxLng - minLng;
    const height = maxLat - minLat;
    const latNorm = (lat - minLat) / height;
    const lngNorm = (lng - minLng) / width;
    const x = padding + lngNorm * (innerWidth - 2 * padding);
    const y = padding + (1 - latNorm) * (innerHeight - 2 * padding);

    return { x, y };
}