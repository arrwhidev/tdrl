import r from 'raylib'
import resources from './game_resources.js'
import config from './game_config.js'
import state from './game_state.js'

export default class EditGridHud {
    constructor(camera) {
        this.camera = camera
        this.cursor = r.Vector2(0, 0);
    }

    update(dt) {
        // camera aware cursor grid position
        this.mouseX = ((r.GetMouseX() / config.SCALING_FACTOR) - this.camera.offset.x) / this.camera.zoom;
        this.mouseY = ((r.GetMouseY() / config.SCALING_FACTOR) - this.camera.offset.y) / this.camera.zoom;
        this.cursor.x = Math.floor(this.mouseX / config.TILE_SIZE);
        this.cursor.y = Math.floor(this.mouseY / config.TILE_SIZE);
    }

    render() {
        const mouseCoords = `(${this.cursor.x}, ${this.cursor.y})`
        r.DrawTextPro(resources.fonts.regular, mouseCoords, { x: 3, y: 3, }, r.Vector2(0,0), 0, config.FONT_SIZE, 1, r.WHITE);
    }
}