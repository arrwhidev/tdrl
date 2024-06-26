import r from 'raylib'
import GameObject from './game_object.js'
import resources from '../../game_resources.js';
import state from '../../game_state.js';
import config from '../../game_config.js';
import { renderSimpleText } from '../../render.js';

class Node {
    constructor(parent, position) {
        this.parent = parent
        this.position = position
        this.g = 0
        this.h = 0
        this.f = 0
    }

    isEqual(node) {
        return (
            node.position.x === this.position.x &&
            node.position.y === this.position.y
        )
    }
}

function astar(maze, start, end) {
    // Create start and end node
    const startNode = new Node(null, start);
    const endNode = new Node(null, end);

    // Initialize both open and closed list
    const openList = [];
    const closedList = [];

    // Add the start node
    openList.push(startNode);

    // Loop until you find the end
    while (openList.length > 0) {
        // Get the current node
        let currentNode = openList[0];
        let currentIndex = 0;

        // find the smallest f value node in the open list
        for (let index = 0; index < openList.length; index++) {
            if (openList[index].f < currentNode.f) {
                currentNode = openList[index];
                currentIndex = index;
            }
        }

        // Pop current off open list, add to closed list
        openList.splice(currentIndex, 1);
        closedList.push(currentNode);

        // Found the goal
        if (currentNode.isEqual(endNode)) {
            const path = [];
            let current = currentNode;
            while (current !== null) {
                path.push(current.position);
                current = current.parent;
            }
            return path.reverse(); // Return reversed path
        }

        // Generate children
        const children = [];
        const adjacentSquares = [
            {x: -1, y: 0}, // left
            {x: 1, y: 0}, // right
            {x: 0, y: -1}, // above
            {x: 0, y: 1}, // below
        ];

        for (const newPosition of adjacentSquares) {
            // Get node position
            const nodePosition = {
                x: currentNode.position.x + newPosition.x,
                y: currentNode.position.y + newPosition.y
            }

            const numRows = maze.length;
            const numCols = maze[0].length;

            // Make sure within range
            if (nodePosition.y > (numRows - 1) || nodePosition.y < 0 ||
                nodePosition.x > (numCols - 1) || nodePosition.x < 0) {
                continue;
            }

            // Make sure walkable terrain
            if (!maze[nodePosition.y][nodePosition.x].layers[0].walkable) {
                continue;
            }

            // Create new node
            const newNode = new Node(currentNode, nodePosition);

            // Append
            children.push(newNode);
        }

        // Loop through children
        for (const child of children) {
            // Child is on the closed list
            if (closedList.some(closedChild => child.isEqual(closedChild))) {
                continue;
            }

            // Create the f, g, and h values
            child.g = currentNode.g + 1;
            child.h = Math.pow(child.position.y - endNode.position.y, 2) + 
                      Math.pow(child.position.x - endNode.position.x, 2);
            child.f = child.g + child.h;

            // Child is already in the open list
            if (openList.some(openNode => child.isEqual(openNode) && child.g > openNode.g)) {
                continue;
            }

            // Add the child to the open list
            openList.push(child);
        }
    }

    return [];
}


export default class Enemy extends GameObject {
    constructor(gridPosition, width, height, color) {
        super({
            x: gridPosition.x * config.TILE_SIZE,
            y: gridPosition.y * config.TILE_SIZE,
        }, r.Vector2(0, 0), width, height, color);
        
        this.gridPosition = gridPosition
        this.speed = 30;
        this.scale = 0.8;
        this.health = 10
        this.spriteName = 'skeleton_humanoid';
        this.target = { x: 23, y: 13 }
        this.grid = state.grid.map.map
        this.calculatePath(this.target)
    }

    update(dt) {
        if (this.path.length > 0) {
            const roundedX = Math.round(this.position.x)
            const roundedY = Math.round(this.position.y)

            this.gridPosition.x = roundedX / config.TILE_SIZE
            this.gridPosition.y = roundedY / config.TILE_SIZE

            const nextTile = this.path[0]
            const nextTileX = nextTile.x * config.TILE_SIZE
            const nextTileY = nextTile.y * config.TILE_SIZE

            // if we have reached the target tile, shift to next
            if (roundedX === nextTileX && roundedY === nextTileY) {
                this.path.shift()
                return
            }

            if (this.grid[nextTile.y][nextTile.x].layers[0].walkable) {  // Ensure the next step is still walkable
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
                this.calculatePath(this.target)
            }
        }
    }

    calculatePath(target) {
        this.path = astar(this.grid, this.gridPosition, target)
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
        
        if (state.debug) {
            for (let i = 0; i < this.path.length; i++) {
                const prev = this.path[i-1];
                const now = this.path[i];
                if (prev && now) {
                    r.DrawLine(
                        prev.x * config.TILE_SIZE, prev.y * config.TILE_SIZE, now.x * config.TILE_SIZE, now.y * config.TILE_SIZE, r.GREEN
                    )
                }
            }
        }
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