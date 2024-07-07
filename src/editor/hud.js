import state from '../game_state.js'
import { renderSimpleText } from '../render.js'

export default class Hud {
    constructor() {
        this.camera = state.getHudCamera()
        this.values = []
    }

    update(dt) {}

    render() {
        [
            `(${state.gridCursor.cursor.x}, ${state.gridCursor.cursor.y})`,
            `layer ${state.grid.activeLayerIndex}`,
        ].forEach(this.renderText);
    }

    renderText(value, i) {
        renderSimpleText(value, 3, 3 + i * 10);
    }
}