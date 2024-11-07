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

function checkIfClicked(position, body) {
    // Step 1: Translate the click position to the tank's local coordinate system
    const dx = position.x - body.position.x;
    const dy = position.y - body.position.y;

    // Step 2: Rotate the click point in the opposite direction of the tank's rotation
    const angleRad = -body.angle * (Math.PI / 180); // Convert angle to radians
    const rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
    const rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

    // Step 3: Check if the rotated click coordinates fall within the tank's rectangular boundaries
    const isWithinBounds = (
        rotatedX >= -body.comp.halfW &&
        rotatedX <= body.comp.halfW &&
        rotatedY >= -body.comp.halfH &&
        rotatedY <= body.comp.halfH
    );
    // Returns true if within bounds, false otherwise
    return isWithinBounds;
};