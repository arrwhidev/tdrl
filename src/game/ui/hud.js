import r from 'raylib'
import state from '../../game_state.js'
import config from '../../game_config.js'
import { renderSimpleText } from '../../render.js'

export default class Hud {
    constructor() {
        this.camera = state.camera.hud
        this.values = []
    }

    update(dt) {}

    render() {
        [
            `${r.GetFPS()}`,
        ].forEach(this.renderText);
    }

    renderText(value, i) {
        renderSimpleText(value, 3, 3 + i * 10);
    }
}