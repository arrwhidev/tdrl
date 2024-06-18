const r = require('raylib')
const fs = require('fs')

// constants

const WIDTH          = 320
const HEIGHT         = 240
const SCALING_FACTOR = 3

const TILE_SIZE      = 20
const NUM_ROWS       = HEIGHT / TILE_SIZE;
const NUM_COLS       = WIDTH / TILE_SIZE;

// variables

let mode;
let grid;
let waypoints = [];

// init

r.InitWindow(WIDTH * SCALING_FACTOR, HEIGHT * SCALING_FACTOR, "mapedit")
r.SetTargetFPS(0) // uncapped

// load

const mapjson = JSON.parse(fs.readFileSync('map.json'));
const spritesheet = r.LoadTexture(mapjson.sprite_sheet);

// game

const camera = r.Camera2D(r.Vector2(0, 0), r.Vector2(0, 0), 0, 1)
const tex = r.LoadRenderTexture(WIDTH, HEIGHT)

class Grid {
    constructor() {
        this.cursor = r.Vector2(0, 0);
        
        // init grid
        // access via this.grid[row][col]
        this.grid = new Array(NUM_ROWS);
        for (let row = 0; row < NUM_ROWS; row++) {
            if (!this.grid[row]) {
                this.grid[row] = new Array(NUM_COLS);
            }
            for (let col = 0; col < NUM_COLS; col++) {
                const index = row * NUM_COLS + col
                this.grid[row][col] = {
                    index,
                    spritePosition: mapjson.map[index],
                }
            }
        }

        // populate grid
        
    }

    update(dt) {
        // Calculate cursor stuff
        const mouseX = r.GetMouseX() / SCALING_FACTOR;
        const mouseY = r.GetMouseY() / SCALING_FACTOR;
        const cursorGridX = Math.floor(mouseX / TILE_SIZE);
        const cursorGridY = Math.floor(mouseY / TILE_SIZE);
        this.cursor.x = cursorGridX * TILE_SIZE;
        this.cursor.y = cursorGridY * TILE_SIZE;
    }

    render() {

        // grid sprites
        for (let rowIndex = 0; rowIndex < NUM_ROWS; rowIndex++) {
            for (let colIndex = 0; colIndex < NUM_COLS; colIndex++) {
                const { spritePosition } = this.grid[rowIndex][colIndex];
                const row = Math.floor(spritePosition / mapjson.sprite_sheet_cols);
                const col = spritePosition % mapjson.sprite_sheet_cols;
                const spriteRect = {
                    x: col * 16,
                    y: row * 16, 
                    width: 16,
                    height: 16
                }

                r.DrawTexturePro(
                    spritesheet, 
                    spriteRect,
                    { x: colIndex * TILE_SIZE, y: rowIndex * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE},
                    { x: 0, y: 0},
                    0,
                    r.WHITE)
            }
        }

        // grid lines
        for (let rowIndex = 0; rowIndex < NUM_ROWS; rowIndex++) {
            for (let colIndex = 0; colIndex < NUM_COLS; colIndex++) {
                const y = rowIndex * TILE_SIZE;
                const x = colIndex * TILE_SIZE;

                r.DrawRectangleLinesEx({
                    x,
                    y,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                }, 1, { ...r.BLACK, a: 100 })
            }
        }

        // highlight cursor grid element
        const showCursorSelect = true;
        if (showCursorSelect) {
            // const allowed = gridjson[this.cursorGrid.x + (this.cursorGrid.y * NUM_COLS)] === 1;
            // const color = allowed ? {...r.GREEN, a: 100} : {...r.RED, a: 200}
            const color = r.BLACK;
            r.DrawRectangleLinesEx({
                x: this.cursor.x,
                y: this.cursor.y,
                width: TILE_SIZE,
                height: TILE_SIZE,
            }, 1, color)
        }
    }
}

waypoints = [];
grid = new Grid();

while (!r.WindowShouldClose()) {
    const dt = r.GetFrameTime()

    // Update
    grid.update(dt)

    // Render game objects to texture at internal resolution
    r.BeginTextureMode(tex)
    r.ClearBackground(r.RAYWHITE)

    r.BeginMode2D(camera)
        grid.render();
    r.EndTextureMode()

    // Render the texture and scale it
    r.BeginDrawing()
    r.ClearBackground(r.RAYWHITE);
        r.DrawTexturePro(
            tex.texture,
            { x:0, y:0, width: tex.texture.width, height: -tex.texture.height },
            { x:0, y:0, width: tex.texture.width * SCALING_FACTOR, height: tex.texture.height * SCALING_FACTOR },
            { x:0, y:0 },
            0.0,
            r.WHITE);
    r.EndDrawing();
}
r.CloseWindow()