import r from 'raylib'
import config from './game_config.js'

export function RenderAndScaleTexture(texture) {
    r.BeginDrawing()
    r.ClearBackground(r.RAYWHITE);
        r.DrawTexturePro(
            texture,
            { x:0, y:0, width: texture.width, height: -texture.height },
            { x:0, y:0, width: texture.width * config.SCALING_FACTOR, height: texture.height * config.SCALING_FACTOR },
            { x:0, y:0 },
            0.0,
            r.WHITE);
    r.EndDrawing();
}