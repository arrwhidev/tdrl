import * as r from 'raylib'
import { Map } from '../map'

export class Node {
    
    parent: Node
    position: r.Vector2
    g: number
    h: number
    f: number

    constructor(parent: Node, position: r.Vector2) {
        this.parent = parent
        this.position = position
        this.g = 0
        this.h = 0
        this.f = 0
    }

    isEqual(node: Node): boolean {
        return (
            node.position.x === this.position.x &&
            node.position.y === this.position.y
        )
    }
}

export function astar(map: Map, start: r.Vector2, end: r.Vector2) {
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

            const numRows = map.getNumRows();
            const numCols = map.getNumCols();

            // Make sure within range
            if (nodePosition.y > (numRows - 1) || nodePosition.y < 0 ||
                nodePosition.x > (numCols - 1) || nodePosition.x < 0) {
                continue;
            }

            // Make sure walkable terrain
            const tileLayer = map.getTileLayer(nodePosition.y, nodePosition.x, 0)
            if (!tileLayer.walkable) {
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