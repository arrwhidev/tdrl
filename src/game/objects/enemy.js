import r from 'raylib'
import GameObject from './game_object.js'
import resources from '../../game_resources.js';
import state from '../../game_state.js';
import config from '../../game_config.js';
import { renderSimpleText } from '../../render.js';

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().element;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);  // Manhattan distance
}

function aStar(start, goal, grid) {
    const openSet = new PriorityQueue();
    openSet.enqueue(start, 0);

    const cameFrom = new Map();

    const gScore = new Map();
    gScore.set(start, 0);

    const fScore = new Map();
    fScore.set(start, heuristic(start, goal));

    let i = 0
    while (!openSet.isEmpty()) {
        console.log('tick', i++)
        const current = openSet.dequeue();

        if (current.x === goal.x && current.y === goal.y) {
            return reconstructPath(cameFrom, current);
        }

        for (const neighbor of getNeighbors(current, grid)) {
            const tentativeGScore = gScore.get(current) + 1;

            if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + heuristic(neighbor, goal));

                if (!openSet.elements.some(element => element.element === neighbor)) {
                    openSet.enqueue(neighbor, fScore.get(neighbor));
                }
            }
        }
    }

    return [];  // No path found
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const directions = [
        { x: 1, y: 0 }, { x: -1, y: 0 },
        { x: 0, y: 1 }, { x: 0, y: -1 }
    ];

    for (const direction of directions) {
        const neighborX = node.x + direction.x;
        const neighborY = node.y + direction.y;

        if (neighborX >= 0 && neighborX < grid[0].length &&
            neighborY >= 0 && neighborY < grid.length &&
            grid[neighborY][neighborX].layers[0].walkable) {  // Assuming 0 is walkable and 1 is non-walkable
            neighbors.push({ x: neighborX, y: neighborY });
        }
    }

    return neighbors;
}

function reconstructPath(cameFrom, current) {
    const totalPath = [current];

    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        totalPath.unshift(current);
    }

    return totalPath;
}

export default class Enemy extends GameObject {
    constructor(gridPosition, width, height, color) {
        super({x: gridPosition.x * config.TILE_SIZE,
            y: gridPosition.y * config.TILE_SIZE,
        }, r.Vector2(0, 0), width, height, color);
        this.gridPosition = gridPosition
        this.speed = 10;
        this.scale = 0.8;
        this.health = 10
        this.spriteName = 'skeleton_humanoid';

        // grid target position
        this.target = {
            x: 23,
            y: 13,
        }

        this.grid = state.grid.map.map
        this.path = aStar(this.gridPosition, this.target, this.grid);
        console.log('path calculated, steps:', this.path.length)

        if (this.path.length > 0) {
            this.nextTile = this.path.shift();
        }
    }

    update(dt) {
        if (this.path.length > 0) {
            const roundedX = Math.round(this.position.x)
            const roundedY = Math.round(this.position.y)
            const nextTileX = this.nextTile.x * config.TILE_SIZE
            const nextTileY = this.nextTile.y * config.TILE_SIZE

            // if we have reached next tile, shift it
            if (roundedX === nextTileX && roundedY === nextTileY) {
                this.nextTile = this.path.shift();
            }

            if (this.grid[this.nextTile.y][this.nextTile.x].layers[0].walkable) {  // Ensure the next step is still walkable
                const diffVector = {
                    x: nextTileX - this.position.x,
                    y: nextTileY - this.position.y,
                }
        
                const normalized = r.Vector2(0,0)
                const length = Math.sqrt(Math.pow(diffVector.x, 2) + Math.pow(diffVector.y, 2))
                if (length != 0) {
                    normalized.x = diffVector.x / length
                    normalized.y = diffVector.y / length
                }
        
                this.velocity.x = normalized.x * this.speed
                this.velocity.y = normalized.y * this.speed
        
                this.position.x += this.velocity.x * dt;
                this.position.y += this.velocity.y * dt;
            } else {
                // Recalculate the path if the next step is not walkable
                this.path = aStar(this.position, this.target, this.grid);
            }
        }
    }

    render() {
        let { texture, rect } = resources.getSprite(this.spriteName);
        r.DrawTexturePro(
            texture,
            rect,
            { 
                x: this.position.x,
                y: this.position.y,
                width: this.width * this.scale,
                height: this.height * this.scale,
            },
            { x: 0, y: 0 },
            0,
            r.WHITE)
    }

    rect() {
        return {
            x: this.position.x - this.width,
            y: this.position.y - this.height,
            width: this.width * 2,
            height: this.height * 2,
        }
    }
}