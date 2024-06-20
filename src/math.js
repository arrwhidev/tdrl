export const RAD2DEG = 180 / Math.PI;
export const DEG2RAD = Math.PI / 180;

export function euclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
    );
}