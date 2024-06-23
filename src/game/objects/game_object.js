import r from 'raylib'
import state from '../../game_state.js'
import config from '../../game_config.js'

export default class GameObject {
    constructor(position, velocity, width, height, color) {
        this.position = position || r.Vector2(0, 0);
        this.velocity = velocity || null;
        this.width = width || 0;
        this.height = height || 0;
        this.color = color || r.BLACK;
    }

    update(dt) {}
    render() {}

    rect() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
        }
    }
}