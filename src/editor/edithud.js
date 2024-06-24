import state from '../game_state.js'
import { renderSimpleText } from '../render.js'

export default class EditGridHud {
    constructor() {
        this.camera = state.camera.hud
    }

    update(dt) {}

    render() {
        const mouseCoords = `(${state.gridCursor.cursor.x}, ${state.gridCursor.cursor.y})`;
        renderSimpleText(mouseCoords, 3, 3);

        const layerInfo = 'layer ' + state.grid.activeLayerIndex;
        renderSimpleText(layerInfo, 3, 15);
    }
}