import * as r from 'raylib'
import config from './game_config.js'
import resources from './game_resources.js'
import state from './game_state.js';
import GameObject from './game/objects/game_object.js';

export function renderAndScaleTexture(texture) {
    r.BeginDrawing()
        r.ClearBackground(r.BLACK);
        r.DrawTexturePro(
            texture,
            { x:0, y:0, width: texture.width, height: -texture.height },
            { x:0, y:0, width: texture.width * config.SCALING_FACTOR, height: texture.height * config.SCALING_FACTOR },
            { x:0, y:0 },
            0.0,
            r.WHITE);
    r.EndDrawing();
}

export function renderSimpleText(text, x, y) {
    r.DrawTextPro(
        resources.fonts.regular, 
        text, 
        { x, y }, 
        { x: 0, y: 0 },
        0,
        config.FONT_SIZE, 
        1, 
        r.WHITE);
    }

export function renderGameObject(go: GameObject) {
    r.BeginMode2D(go.camera || state.getGameCamera())
    go.render()
    r.EndMode2D()
}