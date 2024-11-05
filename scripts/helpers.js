// Check if two projections overlap on an axis
function log(msg){
    console.log(msg);
}

function projectionsOverlap(min1, max1, min2, max2) {
    return !(min1 > max2 || min2 > max1);
}

// Project a polygon onto an axis and get min and max values
function projectPolygon(corners, axis) {
    let min = (corners[0].x * axis.x) + (corners[0].y * axis.y);
    let max = min;
    for (let i = 1; i < corners.length; i++) {
        const projection = (corners[i].x * axis.x) + (corners[i].y * axis.y);
        if (projection < min) min = projection;
        if (projection > max) max = projection;
    }
    return { min, max };
}

function getRotatedCorners(obj) {
    const angleRad = obj.angle * (Math.PI / 180); // Convert angle to radians

    // Center of the tank
    const cx = obj.position.x;
    const cy = obj.position.y;

    // Half dimensions
    const halfW = obj.comp.halfW;
    const halfH = obj.comp.halfH;

    // Calculate the corners with rotation
    return [
        {
            x: cx + (Math.cos(angleRad) * -halfW - Math.sin(angleRad) * -halfH),
            y: cy + (Math.sin(angleRad) * -halfW + Math.cos(angleRad) * -halfH)
        },
        {
            x: cx + (Math.cos(angleRad) * halfW - Math.sin(angleRad) * -halfH),
            y: cy + (Math.sin(angleRad) * halfW + Math.cos(angleRad) * -halfH)
        },
        {
            x: cx + (Math.cos(angleRad) * halfW - Math.sin(angleRad) * halfH),
            y: cy + (Math.sin(angleRad) * halfW + Math.cos(angleRad) * halfH)
        },
        {
            x: cx + (Math.cos(angleRad) * -halfW - Math.sin(angleRad) * halfH),
            y: cy + (Math.sin(angleRad) * -halfW + Math.cos(angleRad) * halfH)
        }
    ];
};

function normalizeAngleDifference(angleDifference) {
    angleDifference = (angleDifference + 360) % 360; // Bring within [0, 360]
    if (angleDifference > 180) angleDifference -= 360; // Adjust to [-180, 180]
    return angleDifference;
};