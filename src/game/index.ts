import * as r from 'raylib'
import state from '../game_state.js'
import config from '../game_config.js'
import resources from '../game_resources.js'
import { checkCollisions } from './collision.js'
import { renderAndScaleTexture, renderGameObject } from '../render.js'
import Hud from './ui/hud.js'
import Grid from './grid.js'
import GridCursor from '../grid_cursor.js'
import EnemyEmitter from './objects/enemy_emitter.js'
// import Guy from './objects/guy.js'
import { Map } from '../map.js';
import { Vec2 } from '../math.js'
import { cleanGameObjects } from './clean.js'
import Projectile from './objects/projectile.js'
import GameObject from './objects/game_object.js'

// init
r.InitWindow(config.WIDTH * config.SCALING_FACTOR, config.HEIGHT * config.SCALING_FACTOR, "tdrl")
r.SetTargetFPS(0)
r.InitAudioDevice()

// load resources
resources.load();

// music
// r.PlayMusicStream(resources.music.bg)

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
const grid = new Grid()
const gridCursor = new GridCursor()
const hud = new Hud()

state.map = map
state.grid = grid
state.gridCursor = gridCursor
state.hud = hud;
state.enemyEmitters.push(new EnemyEmitter())
// state.guys.push(new Guy({ x: 22, y: 13 }, 20, 20, r.WHITE))

const tex = r.LoadRenderTexture(config.WIDTH, config.HEIGHT)
while (!r.WindowShouldClose()) {
    const dt = r.GetFrameTime()

    /**
     * Main Input
     */

    if (r.IsKeyPressed(r.KEY_SPACE)) {
        state.togglePaused()
    } else if (r.IsKeyReleased(r.KEY_D)) {
        state.toggleDebug()
    }

    const gameObjects = state.getGameObjects();

    /**
     * Update
     */

    r.UpdateMusicStream(resources.music.bg);
    if (state.isPlaying()) {
        state.grid.update(dt);
        gameObjects.forEach((go: GameObject) => {
            go.update(dt)            
        })
        state.gridCursor.update(dt)
        state.hud.update(dt)

        checkCollisions();
        cleanGameObjects();
    }

    /**
     * Render
     */

    // Render game objects to texture at internal resolution
    r.BeginTextureMode(tex)
    r.ClearBackground(r.BLACK)

    renderGameObject(state.grid)
    gameObjects.forEach((go: GameObject) => {
        renderGameObject(go);
    })
    renderGameObject(state.gridCursor)
    renderGameObject(state.hud)

    r.EndTextureMode()

    // Scale to full resolution
    renderAndScaleTexture(tex.texture)
}

r.CloseWindow()