import r from 'raylib'
import state from '../game_state.js'
import config from '../game_config.js'
import resources from '../game_resources.js'
import { renderAndScaleTexture } from '../render.js'
import Hud from './ui/hud.js'
import Grid from './grid.js'
import GridCursor from '../grid_cursor.js'
import Enemy from './objects/enemy.js'
import EnemyEmitter from './objects/enemy_emitter.js'

// init
r.InitWindow(config.WIDTH * config.SCALING_FACTOR, config.HEIGHT * config.SCALING_FACTOR, "tdrl")
r.SetTargetFPS(0)
r.InitAudioDevice()

// load resources
resources.load();

// music
r.PlayMusicStream(resources.music.bg)

// cameras
const camera = r.Camera2D(r.Vector2(0, 0), r.Vector2(0, 0), 0, 1)
camera.zoom = 0.6
const hudCamera = r.Camera2D(r.Vector2(0, 0), r.Vector2(0, 0), 0, 1)
hudCamera.zoom = 1
state.camera.game = camera
state.camera.hud = hudCamera

// game objects
const grid = new Grid('dungeon')
const gridCursor = new GridCursor()
const hud = new Hud()
const emitter = new EnemyEmitter();


const gameObjects = []
gameObjects.push(grid)
gameObjects.push(gridCursor)
gameObjects.push(emitter)
gameObjects.push(hud)

// Keep references to important stuff in global state
state.grid = grid
state.gridCursor = gridCursor

const tex = r.LoadRenderTexture(config.WIDTH, config.HEIGHT)
while (!r.WindowShouldClose()) {
    const dt = r.GetFrameTime()

    /**
     * Update
     */

    r.UpdateMusicStream(resources.music.bg);
    gameObjects.forEach(o => o.update(dt))

    /**
     * Render
     */

    // Render game objects to texture at internal resolution
    r.BeginTextureMode(tex)
    r.ClearBackground(r.BLACK)
    gameObjects.forEach(item =>  {
        r.BeginMode2D(item.camera || state.camera.game)
        item.render()
        r.EndMode2D()
    })
    r.EndTextureMode()

    // Scale to full resolution
    renderAndScaleTexture(tex.texture)
}

r.CloseWindow()