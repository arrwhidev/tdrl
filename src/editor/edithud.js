import r from 'raylib'
import resources from '../game_resources.js'
import config from '../game_config.js'
import state from '../game_state.js'

export default class EditGridHud {
    constructor() {
        this.camera = state.camera.hud
    }

    update(dt) {}

    render() {
        const mouseCoords = `(${state.gridCursor.cursor.x}, ${state.gridCursor.cursor.y})`;
        r.DrawTextPro(resources.fonts.regular, mouseCoords, { x: 3, y: 3, }, r.Vector2(0,0), 0, config.FONT_SIZE, 1, r.WHITE);
    }
}