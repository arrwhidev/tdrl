import r from 'raylib'
import resources from './game_resources.js'
import config from './game_config.js'

export default class Grid {
    constructor() {
        this.cursor = r.Vector2(0, 0);
        
        // init grid
        // access via this.grid[row][col]
        this.grid = new Array(config.NUM_ROWS);
        for (let row = 0; row < config.NUM_ROWS; row++) {
            if (!this.grid[row]) {
                this.grid[row] = new Array(config.NUM_COLS);
            }
            for (let col = 0; col < config.NUM_COLS; col++) {
                const flatIndex = row * config.NUM_COLS + col;
                const spriteId = resources.mapjson.map[flatIndex];
                const spriteRow = Math.floor(spriteId / resources.mapjson.sprite_sheet_cols);
                const spriteCol = spriteId % resources.mapjson.sprite_sheet_cols;
                this.grid[row][col] = {
                    flatIndex,
                    isFree: spriteId === 81,
                    sprite: {
                        id: spriteId,
                        rect: {
                            x: spriteCol * 16,
                            y: spriteRow * 16, 
                            width: 16,
                            height: 16,
                        }
                    }
                }
            }
        }
    }

    update(dt) {
        // cursor grid position
        const mouseX = r.GetMouseX() / config.SCALING_FACTOR;
        const mouseY = r.GetMouseY() / config.SCALING_FACTOR;
        this.cursor.x = Math.floor(mouseX / config.TILE_SIZE);
        this.cursor.y = Math.floor(mouseY / config.TILE_SIZE);
    }

    render() {
        // grid sprites
        for (let row = 0; row < config.NUM_ROWS; row++) {
            for (let col = 0; col < config.NUM_COLS; col++) {
                const g = this.grid[row][col];
                r.DrawTexturePro(
                    resources.spritesheet, 
                    g.sprite.rect,
                    { 
                        x: col * config.TILE_SIZE,
                        y: row * config.TILE_SIZE,
                        width: config.TILE_SIZE,
                        height: config.TILE_SIZE,
                    },
                    { x: 0, y: 0 },
                    0,
                    r.WHITE)
            }
        }

        // grid lines
        // for (let row = 0; row < config.NUM_ROWS; row++) {
        //     for (let col = 0; col < config.NUM_COLS; col++) {
        //         r.DrawRectangleLinesEx({
        //             x: col * config.TILE_SIZE,
        //             y: row * config.TILE_SIZE,
        //             width: config.TILE_SIZE,
        //             height: config.TILE_SIZE,
        //         }, 1, { ...r.BLACK, a: 100 })
        //     }
        // }

        // // highlight cursor grid element
        // const showCursorSelect = true;
        // if (showCursorSelect) {
        //     let g = this.grid[this.cursor.y]
        //     if (g) {
        //         g = g[this.cursor.x]
        //         if (g) {
        //             const color = g.isFree ? {...r.GREEN, a: 200} : {...r.RED, a: 200}
        //             r.DrawRectangleLinesEx({
        //                 x: this.cursor.x * config.TILE_SIZE,
        //                 y: this.cursor.y * config.TILE_SIZE,
        //                 width: config.TILE_SIZE,
        //                 height: config.TILE_SIZE,
        //             }, 1, color)
        //         }
        //     }
        // }
    }
}