import r from 'raylib'
import resources from './game_resources.js'
import config from './game_config.js'
import state from './game_state.js'

export default class Grid {
    constructor(mapName, camera) {
        this.camera = camera;
        this.mapName = mapName;
        resources.loadMap(mapName)
        this.rawMap = resources.getMap(mapName)
        const { rows, cols, map, special } = this.rawMap;
        this.map = map;
        this.special = special
        this.rows = rows;
        this.cols = cols;
        this.activeSpriteIndex = 0
        this.cursor = r.Vector2(0, 0);
        
        // init grid
        // access via this.grid[row][col]
        this.grid = new Array(rows);
        for (let row = 0; row < rows; row++) {
            if (!this.grid[row]) {
                this.grid[row] = new Array(cols);
            }

            for (let col = 0; col < cols; col++) {
                const flatIndex = row * cols + col;
                
                // init empty struct
                this.grid[row][col] = {
                    flatIndex,
                    spriteName: this.map[flatIndex]
                }
 
                // const spriteId = resources.mapjson.map[flatIndex];
                // const spriteRow = Math.floor(spriteId / resources.mapjson.sprite_sheet_cols);
                // const spriteCol = spriteId % resources.mapjson.sprite_sheet_cols;
                // this.grid[row][col] = {
                //     flatIndex,
                //     isFree: spriteId === 81,
                //     sprite: {
                //         id: spriteId,
                //         rect: {
                //             x: spriteCol * 16,
                //             y: spriteRow * 16, 
                //             width: 16,
                //             height: 16,
                //         }
                //     }
                // }
            }
        }
    }

    update(dt) {
        // camera aware cursor grid position
        this.mouseX = ((r.GetMouseX() / config.SCALING_FACTOR) - this.camera.offset.x) / this.camera.zoom;
        this.mouseY = ((r.GetMouseY() / config.SCALING_FACTOR) - this.camera.offset.y) / this.camera.zoom;
        this.cursor.x = Math.floor(this.mouseX / config.TILE_SIZE);
        this.cursor.y = Math.floor(this.mouseY / config.TILE_SIZE);

        if(r.IsKeyPressed(r.KEY_P)) {
            this.activeSpriteIndex = (this.activeSpriteIndex + 1) % resources.spriteCount()
        }
        if (r.IsKeyPressed(r.KEY_O)) {
            this.activeSpriteIndex = ((this.activeSpriteIndex - 1) + resources.spriteCount()) % resources.spriteCount()
        }
        if (r.IsKeyPressed(r.KEY_C)) {
            let g = this.grid[this.cursor.y]
            if (g) {
                g = g[this.cursor.x]
                if (g) {
                    // clear
                    this.grid[this.cursor.y][this.cursor.x].spriteName = ''
                }
            }
        }
        if (r.IsMouseButtonDown(r.MOUSE_BUTTON_LEFT)) {
            let g = this.grid[this.cursor.y]
            if (g) {
                g = g[this.cursor.x]
                if (g) {
                    // update the spriteName
                    const name = resources.getSpriteNameAtIndex(this.activeSpriteIndex)
                    this.grid[this.cursor.y][this.cursor.x].spriteName = name
                }
            }
        }
        if (r.IsKeyPressed(r.KEY_ENTER)) {
            const array = []
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    array.push(this.grid[row][col].spriteName)
                }
            }
            resources.saveMap(this.mapName, {
                ...this.rawMap,
                map: array
            })
        }
    }

    render() {
        // grid sprites
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const g = this.grid[row][col];
                if (g.spriteName !== '') {
                    let { texture, rect } = resources.getSprite(g.spriteName)
                    r.DrawTexturePro(
                        texture,
                        rect,
                        { 
                            x: col * config.TILE_SIZE,
                            y: row * config.TILE_SIZE,
                            width: config.TILE_SIZE,
                            height: config.TILE_SIZE,
                        },
                        { x: 0, y: 0 },
                        0,
                        r.WHITE)
                } else {
                    r.DrawRectangle(
                        col * config.TILE_SIZE,
                        row * config.TILE_SIZE,
                        config.TILE_SIZE,
                        config.TILE_SIZE,
                        r.BLACK)
                }
            }
        }

        // map specials
        Object.keys(this.special).forEach(key => {
            const sprite = resources.getSprite(key)
            r.DrawTexturePro(
                sprite.texture,
                sprite.rect,
                { 
                    x: this.special[key].x * config.TILE_SIZE,
                    y: this.special[key].y * config.TILE_SIZE,
                    width: config.TILE_SIZE,
                    height: config.TILE_SIZE,
                },
                { x: 0, y: 0 },
                0,
                r.WHITE)
        })

        // grid lines
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                r.DrawRectangleLinesEx({
                    x: col * config.TILE_SIZE,
                    y: row * config.TILE_SIZE,
                    width: config.TILE_SIZE,
                    height: config.TILE_SIZE,
                }, 1, { ...r.BLACK, a: 100 })
            }
        }

        // highlight cursor grid element
        let g = this.grid[this.cursor.y]
        if (g) {
            g = g[this.cursor.x]
            if (g) {
                // r.DrawRectangleLinesEx({
                //     x: this.cursor.x * config.TILE_SIZE,
                //     y: this.cursor.y * config.TILE_SIZE,
                //     width: config.TILE_SIZE,
                //     height: config.TILE_SIZE,
                // }, 1, r.BLACK)

            const sprite = resources.getSprite('cursor')
            r.DrawTexturePro(
                sprite.texture,
                sprite.rect,
                { 
                    x: this.cursor.x * config.TILE_SIZE,
                    y: this.cursor.y * config.TILE_SIZE,
                    width: config.TILE_SIZE,
                    height: config.TILE_SIZE,
                },
                { x: 0, y: 0 },
                0,
                r.WHITE)
            }
        }

        // current sprite tile at cursor
        const { texture, rect } = resources.getSpriteAtIndex(this.activeSpriteIndex)
        r.DrawTexturePro(
            texture,
            rect,
            { 
                x: this.mouseX,
                y: this.mouseY,
                width: config.TILE_SIZE,
                height: config.TILE_SIZE,
            },
            { x: 0, y: 0 },
            0,
            r.WHITE)
    }
}