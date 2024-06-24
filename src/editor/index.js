import r from 'raylib'
import config from '../game_config.js'
import state from '../game_state.js'
import resources from '../game_resources.js'
import EditGrid from './editgrid.js'
import EditGridHud from './edithud.js'
import GridCursor from '../grid_cursor.js'
import { renderAndScaleTexture } from '../render.js'

// init
r.InitWindow(config.WIDTH * config.SCALING_FACTOR, config.HEIGHT * config.SCALING_FACTOR, "tdrl")
r.SetTargetFPS(0)
r.InitAudioDevice()

// load resourcess
resources.load();

// cameras
const camera = r.Camera2D(r.Vector2(0, 0), r.Vector2(0, 0), 0, 1)
camera.zoom = 0.9
const hudCamera = r.Camera2D(r.Vector2(0, 0), r.Vector2(0, 0), 0, 1)
hudCamera.zoom = 1
state.camera.game = camera
state.camera.hud = hudCamera

// game objects
const grid = new EditGrid('dungeon')
const gridCursor = new GridCursor()
const hud = new EditGridHud()

const gameObjects = []
gameObjects.push(grid)
gameObjects.push(gridCursor)
gameObjects.push(hud)

// Keep references to important stuff in global state
state.grid = grid
state.gridCursor = gridCursor

// Center the grid in the center of the screen
camera.offset.x = (config.WIDTH - (grid.map.getNumCols() * config.TILE_SIZE * camera.zoom)) / 2;
camera.offset.y = (config.HEIGHT - (grid.map.getNumRows() * config.TILE_SIZE * camera.zoom)) / 2;

// game loop
const tex = r.LoadRenderTexture(config.WIDTH, config.HEIGHT)
while (!r.WindowShouldClose()) {
    const dt = r.GetFrameTime()
    
    /**
     * Update
     */

    gameObjects.forEach(o => o.update(dt))
    
    /**
     * Render
     */

    // Render game objects to texture at internal resolution
    r.BeginTextureMode(tex)
    r.ClearBackground(r.BLACK)
    gameObjects.forEach(item =>  {
        r.BeginMode2D(item.camera)
        item.render()
        r.EndMode2D()
    })
    r.EndTextureMode()

    // Scale to full resolution
    renderAndScaleTexture(tex.texture)
}

r.CloseWindow()