import * as r from 'raylib'
import state from '../../game_state.js'
import config from '../../game_config.js'
import { renderSimpleText } from '../../render.js'

export default class Hud {
    
    camera: r.Camera2D
    values: string[]
    
    constructor() {
        this.camera = state.getHudCamera()
        this.values = []
    }

    update(dt) {}

    render() {
        [
            `${r.GetFPS()}`,
            `grid (${state.gridCursor.cursor.x}, ${state.gridCursor.cursor.y})`,
            // `mouse (${state.gridCursor.mouse.x}, ${state.gridCursor.mouse.y})`,
            // `norm (${state.gridCursor.getCursorNormalizedX()}, ${state.gridCursor.getCursorNormalizedY()})`,
        ].forEach(this.renderText);
    }

    renderText(value, i) {
        renderSimpleText(value, 3, 3 + i * 10);
    }
}