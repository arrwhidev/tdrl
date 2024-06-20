import r from 'raylib'
import GameObject from './objects/game_object.js'
import state from './game_state.js'
import config from './game_config.js'
import resources from './game_resources.js'

export default class Hud extends GameObject {
    constructor() {
        super({ x: config.WIDTH / 2, y: 0 }, null, 0, 0, r.WHITE)
        this.margin = 3;
    }
    update() {}

    render() {
        const renderHud = true;
        if (renderHud) {
            // naive config.WIDTH calculation
            const pixelsPerCharacter = 6;
            const value = state.player.coins + " coins";
            const width = value.length * pixelsPerCharacter;
            r.DrawTextPro(resources.fontRegular, value, {
                x: this.position.x - width / 2,
                y: this.position.y + this.margin
            }, r.Vector2(0,0), 0, config.FONT_SIZE, 1, r.WHITE);
        }

        if (state.debug) {
            r.DrawTextPro(resources.fontRegular, r.GetFPS() + "fps", 
            { x: 3, y: 3 }, { x: 0, y: 0}, 0, config.FONT_SIZE, 1, r.WHITE);
        }
    }
}
