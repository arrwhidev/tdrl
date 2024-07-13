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
    hits: number

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
            scale: 1,
            speed
        })

        this.hits = 1
        this.damage = 5
        this.alive = true
    }

    update(dt) {
        if (this.hits < 1) {
            this.kill()
            return
        }

        this.position.x += this.velocity.x * dt
        this.position.y += this.velocity.y * dt
    }

    render() {
        if (this.alive) {
            const center = this.getCenter()

            r.DrawCircle(center.x, center.y, this.width/2, r.WHITE)

            if (state.debug) {
                // draw bounding rect
                r.DrawRectangleLinesEx(this.rect(), 0.4, r.GREEN)

                // draw center
                r.DrawCircle(center.x, center.y, 0.2, r.GREEN)
            }
        }
    }

    kill() {
        this.alive = false
    }

    reduceHits(): void {
        this.hits--
        if (this.hits < 1) {
            this.kill()
        }
    }

    getDamage(): number {
        return this.damage;
    }
}