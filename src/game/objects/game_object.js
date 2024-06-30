import r from 'raylib'
import state from '../../game_state.js'
import config from '../../game_config.js'

export default class GameObject {

    constructor(position, velocity, width, height, scale, speed, color) {
        this.position = position || r.Vector2(0, 0);
        this.velocity = velocity || r.Vector2(0, 0);
        this.width = width || 0;
        this.height = height || 0;
        this.scale = scale || 1;
        this.speed = speed || 30;
        this.color = color || r.PINK;
    }

    update(dt) {}
    render() {}

    rect() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width * this.scale,
            height: this.height * this.scale,
        }
    }

    getCenter() {
        return {
            x: this.getCenterX(),
            y: this.getCenterY(),
        }
    }

    getCenterX() {
        return this.position.x + this.width / 2 * this.scale
    }

    getCenterY() {
        return this.position.y + this.height / 2 * this.scale
    }
}