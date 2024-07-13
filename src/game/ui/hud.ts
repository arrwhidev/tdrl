import * as r from 'raylib'
import state from '../../game_state.js'
import config from '../../game_config.js'
import { renderSimpleText } from '../../render.js'
import GameObject from '../objects/game_object.js'

export default class Hud extends GameObject {
    
    values: string[]
    
    constructor() {
        super({})
        this.camera = state.getHudCamera()
        this.values = []
    }

    update(dt) {}

    render() {
        [
            `${r.GetFPS()}`,
            `grid (${state.gridCursor.cursor.x}, ${state.gridCursor.cursor.y})`,
            `enemyEmitters ${state.enemyEmitters.length}`,

            // `mouse (${state.gridCursor.mouse.x}, ${state.gridCursor.mouse.y})`,
            // `norm (${state.gridCursor.getCursorNormalizedX()}, ${state.gridCursor.getCursorNormalizedY()})`,
        ].forEach(this.renderText);
    }

    renderText(value, i) {
        renderSimpleText(value, 3, 3 + i * 10);
    }
}