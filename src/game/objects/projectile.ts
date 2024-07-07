import * as r from 'raylib'
import GameObject, { GameObjectConfig } from './game_object.js'
import state from '../../game_state.js'
import config from '../../game_config.js'
import {
    DEG2RAD,
} from '../../math.js'

export default class Projectile extends GameObject {
    
    alive: boolean
    damage: number

    constructor(position: r.Vector2, angle: number) {
        const radians = angle * DEG2RAD;
        const speed = 200
        const velocity = {
            x: Math.cos(radians) * speed,
            y: Math.sin(radians) * speed,
        }
        super({
            position,
            velocity,
            width: 2,
            height: 2,
            speed
        })

        this.damage = 2
        this.alive = true
    }

    update(dt) {
        this.position.x += this.velocity.x * dt
        this.position.y += this.velocity.y * dt
    }

    render() {
        r.DrawCircle(this.position.x, this.position.y, this.width, r.WHITE)

        if (state.debug) {
            // draw bounding rect
            const rect = this.rect()
            r.DrawRectangleLines(rect.x, rect.y, rect.width, rect.height, r.GREEN)

            // draw center
            const center = this.getCenter()
            r.DrawCircle(center.x, center.y, 1, r.GREEN)
        }
    }

    kill() {
        this.alive = false
    }
}