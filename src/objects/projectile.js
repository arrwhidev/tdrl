import r from 'raylib'
import GameObject from './game_object.js'
import state from '../game_state.js'
import config from '../game_config.js'
import {
    DEG2RAD,
} from '../math.js'

export default class Projectile extends GameObject {

    constructor(position, angle) {
        super(position)
        this.damage = 2
        this.width = 2
        this.speed = 200

        const radians = angle * DEG2RAD;
        this.velocity = {
            x: Math.cos(radians) * this.speed,
            y: Math.sin(radians) * this.speed,
        }
        this.alive = true
    }

    update(dt) {
        this.position.x += this.velocity.x * dt
        this.position.y += this.velocity.y * dt
    }

    render() {
        r.DrawCircle(this.position.x, this.position.y, this.width, r.WHITE)
    }

    kill() {
        this.alive = false
    }

    rect() {
        return {
            x: this.position.x, 
            y: this.position.y,
            width: this.width,
            height: this.height,
        }
    }
}