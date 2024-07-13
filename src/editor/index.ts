import * as r from 'raylib'
import config from '../game_config.js'
import state from '../game_state.js'
import resources from '../game_resources.js'
import EditorGrid from './editor_grid.js'
import Hud from './hud.js'
import GridCursor from '../grid_cursor.js'
import { renderAndScaleTexture } from '../render.js'
import { Vec2 } from '../math.js'
import { Map } from '../map.js';

// init
r.InitWindow(config.WIDTH * config.SCALING_FACTOR, config.HEIGHT * config.SCALING_FACTOR, "editor")
r.SetTargetFPS(0)
r.InitAudioDevice()

// load resourcess
resources.load();

// cameras
const gameCamera: r.Camera2D = {
    offset: Vec2(0, 0),
    target: Vec2(0, 0),
    rotation: 0,
    zoom: 1
}
const hudCamera: r.Camera2D = {
    offset: Vec2(0, 0),
    target: Vec2(0, 0),
    rotation: 0,
    zoom: 1
}
state.setGameCamera(gameCamera)
state.setHudCamera(hudCamera)

// map
const rawMap = resources.getMap('dungeon')
const map = new Map(rawMap)

// game objects
const grid = new EditorGrid()
const gridCursor = new GridCursor()
const hud = new Hud()

// Keep references to important stuff in global state
state.map = map
state.grid = grid
state.gridCursor = gridCursor

// Center the grid in the center of the screen
// camera.offset.x = (config.WIDTH - (grid.map.getNumCols() * config.TILE_SIZE * camera.zoom)) / 2;
// camera.offset.y = (config.HEIGHT - (grid.map.getNumRows() * config.TILE_SIZE * camera.zoom)) / 2;

const gameObjects = []
gameObjects.push(grid)
gameObjects.push(gridCursor)
gameObjects.push(hud)

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