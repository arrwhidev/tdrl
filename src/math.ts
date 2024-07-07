import * as r from 'raylib'

export const RAD2DEG = 180 / Math.PI;
export const DEG2RAD = Math.PI / 180;

export function euclideanDistance(x1, y1, x2, y2): number {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
    );
}

export function angleBetweenPoints(p1, p2): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.atan2(dy, dx) * RAD2DEG;
}

export function Vec2(x: number = 0, y: number = 0): r.Vector2 {
    return { x, y }
}