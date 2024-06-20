import r from 'raylib'
import state from './game_state.js'
import config from './game_config.js'
import resources from './game_resources.js'
import Hud from './hud.js'
import Grid from './grid.js'
import Tower from './objects/tower.js'
import Shooter from './objects/shooter.js'
import EnemyEmitter from './objects/enemy_emitter.js'


// init
r.InitWindow(config.WIDTH * config.SCALING_FACTOR, config.HEIGHT * config.SCALING_FACTOR, "tdrl")
r.SetTargetFPS(0) // uncapped

// load resources
resources.load();

// set up game state

state.camera = r.Camera2D(r.Vector2(0, 0), r.Vector2(0, 0), 0, 1)
state.hud = new Hud()
state.grid = new Grid()
state.tower = new Tower({ x: 240, y: 60 }, 25, 25, r.GRAY)
state.enemyEmitter = new EnemyEmitter(1000, 200)

const tex = r.LoadRenderTexture(config.WIDTH, config.HEIGHT)

while (!r.WindowShouldClose()) {
    const dt = r.GetFrameTime()

    // Toggle debug
    if (r.IsKeyPressed(r.KEY_D)) {
        state.debug = !state.debug;
    }

    // Shooter create
    if (r.IsMouseButtonPressed(r.MOUSE_BUTTON_LEFT)) {
        let g = state.grid.grid[state.grid.cursor.y]
        if (g) {
            g = g[state.grid.cursor.x]
            if (g && g.isFree) {
                state.shooters.push(
                    new Shooter({
                        x: (state.grid.cursor.x * config.TILE_SIZE) + (config.TILE_SIZE / 2),
                        y: (state.grid.cursor.y * config.TILE_SIZE) + (config.TILE_SIZE / 2),
                    })
                )
                state.grid.grid[state.grid.cursor.y][state.grid.cursor.x].isFree = false;
            }
        }
    }

    // Update
    state.grid.update(dt)
    state.tower.update(dt)
    state.enemyEmitter.update(dt)
    state.shooters.forEach(shooter => shooter.update(dt))
    state.projectiles.forEach(p => p.update(dt))
    state.hud.update(dt);

    // Collision checks
    state.enemyEmitter.enemies.forEach(enemy => {
        if (r.CheckCollisionRecs(state.tower.rect(), enemy.rect())) {
            state.tower.health = state.tower.health - enemy.damage;
        }

        state.projectiles.forEach(p => {
            if (r.CheckCollisionRecs(p.rect(), enemy.rect())) {
                enemy.health = enemy.health - p.damage;
                p.kill()
            }
        })
    })
    state.projectiles = state.projectiles.filter(p => p.alive);

    // Render game objects to texture at internal resolution
    r.BeginTextureMode(tex)
    r.ClearBackground(r.RAYWHITE)
    r.BeginMode2D(state.camera)
        state.grid.render();
        state.tower.render()
        state.enemyEmitter.render()
        state.shooters.forEach(shooter => shooter.render())
        state.projectiles.forEach(p => p.render())
        state.hud.render();
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