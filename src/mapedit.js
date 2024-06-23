import r from 'raylib'
import config from './game_config.js'
import state from './game_state.js'
import resources from './game_resources.js'
import Grid from './editgrid.js'
import EditGridHud from './edithud.js'

// init
r.InitWindow(config.WIDTH * config.SCALING_FACTOR, config.HEIGHT * config.SCALING_FACTOR, "tdrl")
r.SetTargetFPS(0)
r.InitAudioDevice()

// load resources
resources.load();

// cameras
const camera = r.Camera2D(r.Vector2(0, 0), r.Vector2(0, 0), 0, 1)
camera.zoom = 1

const hudCamera = r.Camera2D(r.Vector2(0, 0), r.Vector2(0, 0), 0, 1)
hudCamera.zoom = 1

// set up game state
const grid = new Grid('dungeon', camera)
const hud = new EditGridHud(hudCamera)

state.grid = grid

const tex = r.LoadRenderTexture(config.WIDTH, config.HEIGHT)
while (!r.WindowShouldClose()) {
    // common stuff
    const dt = r.GetFrameTime()
    const toBeRendered = [
        grid, hud
    ]

    // inputs
    if(r.IsKeyPressed(r.KEY_UP)) {
        state.grid.camera.zoom += 0.05
    } else if(r.IsKeyPressed(r.KEY_DOWN)) {
        state.grid.camera.zoom -= 0.05
    } else if(r.IsKeyPressed(r.KEY_S)) {
        state.grid.camera.offset.y -= 4
    } else if(r.IsKeyPressed(r.KEY_D)) {
        state.grid.camera.offset.x -= 4
    } else if(r.IsKeyPressed(r.KEY_W)) {
        state.grid.camera.offset.y += 4
    } else if(r.IsKeyPressed(r.KEY_A)) {
        state.grid.camera.offset.x += 4
    }

    // Update
    grid.update(dt)
    hud.update(dt)

    // Render game objects to texture at internal resolution
    r.BeginTextureMode(tex)
    r.ClearBackground(r.RAYWHITE)
    
    toBeRendered.forEach(item =>  {
        console.log(item.camera)
        r.BeginMode2D(item.camera)
        item.render()
        r.EndMode2D()
    })
    
    r.EndTextureMode()

    // Render the texture and scale it
    r.BeginDrawing()
    r.ClearBackground(r.RAYWHITE);
        r.DrawTexturePro(
            tex.texture,
            { x:0, y:0, width: tex.texture.width, height: -tex.texture.height },
            { x:0, y:0, width: tex.texture.width * config.SCALING_FACTOR, height: tex.texture.height * config.SCALING_FACTOR },
            { x:0, y:0 },
            0.0,
            r.WHITE);
    r.EndDrawing();
}

r.CloseWindow()