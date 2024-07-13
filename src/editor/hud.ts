import * as r from 'raylib'
import state from '../game_state.js'
import { renderSimpleText } from '../render.js'
import EditorGrid from './editor_grid.js'

export default class Hud {

    camera: r.Camera2D
    values: string[]

    constructor() {
        this.camera = state.getHudCamera()
        this.values = []
    }

    update(dt) {}

    render() {
        const grid: EditorGrid = (state.grid as EditorGrid);

        [
            `(${state.gridCursor.cursor.x}, ${state.gridCursor.cursor.y})`,
            `layer ${grid.activeLayerIndex}`,
        ].forEach(this.renderText);
    }

    renderText(value, i) {
        renderSimpleText(value, 3, 3 + i * 10);
    }
}