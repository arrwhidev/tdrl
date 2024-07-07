import * as r from 'raylib'
import GameObject, { GameObjectConfig } from './game_object.js'
import resources from '../../game_resources.js';
import state from '../../game_state.js';
import config from '../../game_config.js';
import { astar } from '../pathfinding.js';
import { Vec2 } from '../../math.js';

export default class Enemy extends GameObject {
    
    gridPosition: r.Vector2;
    health: number;
    target: r.Vector2;
    path: r.Vector2[];
    
    constructor(config: GameObjectConfig, health: number, target: r.Vector2) {
        super(config)
        this.health = health

        this.target = target
        this.path = []
        this.gridPosition = Vec2()

        this.updateGridPosition()
        this.calculatePath(this.target)
    }

    static createAtGridPosition(row, col): Enemy {
        const health = 10
        const target = { x: 23, y: 13 } // TODO: make dynamic

        return new Enemy({
            position: {
                x: col * config.TILE_SIZE,
                y: row * config.TILE_SIZE,
            },
            width: config.TILE_SIZE,
            height: config.TILE_SIZE,
            speed: 30,
            scale: 0.8,
            spriteName: 'skeleton_humanoid',
        },
        health,
        target,
        )
    }

    updateGridPosition() {
        const roundedX = Math.round(this.position.x)
        const roundedY = Math.round(this.position.y)
        this.gridPosition.x = roundedX / config.TILE_SIZE
        this.gridPosition.y = roundedY / config.TILE_SIZE
    }

    update(dt) {
        if (this.path.length > 0) {
            this.updateGridPosition();

            const roundedX = Math.round(this.position.x)
            const roundedY = Math.round(this.position.y)

            const nextTile = this.path[0]
            const nextTileX = nextTile.x * config.TILE_SIZE
            const nextTileY = nextTile.y * config.TILE_SIZE

            // if we have reached the target tile, shift to next
            if (roundedX === nextTileX && roundedY === nextTileY) {
                this.path.shift()
                return
            }

            if (state.map.getTileLayer(nextTile.y, nextTile.x, 0).walkable) {  // Ensure the next step is still walkable
                const diffVector = {
                    x: nextTileX - this.position.x,
                    y: nextTileY - this.position.y,
                }
        
                const normalized = Vec2(0,0)
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
        this.path = astar(state.map, this.gridPosition, target)
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
            // draw path
            for (let i = 0; i < this.path.length; i++) {
                const prev = this.path[i-1];
                const now = this.path[i];
                if (prev && now) {
                    r.DrawLine(
                        prev.x * config.TILE_SIZE, prev.y * config.TILE_SIZE, now.x * config.TILE_SIZE, now.y * config.TILE_SIZE, r.GREEN
                    )
                }
            }
            
            // draw bounding rect
            const rect = this.rect()
            r.DrawRectangleLines(rect.x, rect.y, rect.width, rect.height, r.GREEN)

            // draw center
            const center = this.getCenter()
            r.DrawCircle(center.x, center.y, 1, r.GREEN)
        }
    }
}