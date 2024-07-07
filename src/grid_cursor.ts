import * as r from 'raylib'
import config from './game_config.js'
import state from './game_state.js'

export default class GridCursor {

    camera: r.Camera2D;
    mouse: r.Vector2;
    cursor: r.Vector2;

    constructor() {
        this.camera = state.getGameCamera();
        this.mouse = { x: 0, y: 0 }
        this.cursor = { x: 0, y: 0 }
    }

    update(dt) {
        this.mouse.x = ((r.GetMouseX() / config.SCALING_FACTOR) - this.camera.offset.x) / this.camera.zoom;
        this.mouse.y = ((r.GetMouseY() / config.SCALING_FACTOR) - this.camera.offset.y) / this.camera.zoom;

        // TODO: rename to row and col
        this.cursor.x = Math.floor(this.mouse.x / config.TILE_SIZE);
        this.cursor.y = Math.floor(this.mouse.y / config.TILE_SIZE);
    }

    getCursorNormalizedX() {
        return this.cursor.x * config.TILE_SIZE
    }

    getCursorNormalizedY() {
        return this.cursor.y * config.TILE_SIZE
    }

    render() {}
}