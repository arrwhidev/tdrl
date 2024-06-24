import r from 'raylib'
import resources from '../game_resources.js'
import config from '../game_config.js'
import state from '../game_state.js'
import { Map } from '../map.js'

export default class EditGrid {
    constructor(mapName) {
        this.camera = state.camera.game;
        this.mapName = mapName

        const rawMap = resources.getMap(mapName)
        this.map = new Map(rawMap)

        this.activeSpriteIndex = 0
    }

    update(dt) {
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
        } else if(r.IsKeyPressed(r.KEY_P)) {
            this.activeSpriteIndex = (this.activeSpriteIndex + 1) % resources.spriteCount()
        } else if (r.IsKeyPressed(r.KEY_O)) {
            this.activeSpriteIndex = ((this.activeSpriteIndex - 1) + resources.spriteCount()) % resources.spriteCount()
        } else if (r.IsKeyPressed(r.KEY_C)) {
            let g = this.grid[state.gridCursor.cursor.y]
            if (g) {
                g = g[state.gridCursor.cursor.x]
                if (g) {
                    // clear
                    this.grid[state.gridCursor.cursor.y][state.gridCursor.cursor.x].spriteName = null
                }
            }
        } else if (r.IsKeyPressed(r.KEY_ENTER)) {
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
        } else if (r.IsMouseButtonDown(r.MOUSE_BUTTON_LEFT)) {
            let g = this.grid[state.gridCursor.cursor.y]
            if (g) {
                g = g[state.gridCursor.cursor.x]
                if (g) {
                    // update the spriteName
                    const name = resources.getSpriteNameAtIndex(this.activeSpriteIndex)
                    this.grid[state.gridCursor.cursor.y][state.gridCursor.cursor.x].spriteName = name
                }
            }
        }
    }

    render() {
        // grid sprites
        for (let layer = 0; layer < this.map.getNumLayers(); layer++) {
            for (let row = 0; row < this.map.getNumRows(); row++) {
                for (let col = 0; col < this.map.getNumCols(); col++) {
                    const tileLayer = this.map.getTileLayer(row, col, layer)
                    if (tileLayer.spriteName !== null) {
                        let { texture, rect } = resources.getSprite(tileLayer.spriteName);
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
                        if (layer === 0) {
                            // on layer = render black if there is no sprite
                            r.DrawRectangle(
                                col * config.TILE_SIZE,
                                row * config.TILE_SIZE,
                                config.TILE_SIZE,
                                config.TILE_SIZE,
                                r.BLACK)
                        } else {
                            // on higher layers do not render anything
                        }
                    }
                }
            }
        }
      

        // grid lines
        for (let row = 0; row < this.map.getNumRows(); row++) {
            for (let col = 0; col < this.map.getNumCols(); col++) {
                r.DrawRectangleLinesEx({
                    x: col * config.TILE_SIZE,
                    y: row * config.TILE_SIZE,
                    width: config.TILE_SIZE,
                    height: config.TILE_SIZE,
                }, 1, { ...r.WHITE, a: 100 })
            }
        }

        // highlight cursor grid element
        const sprite = resources.getSprite('cursor')
        r.DrawTexturePro(
            sprite.texture,
            sprite.rect,
            { 
                x: state.gridCursor.cursor.x * config.TILE_SIZE,
                y: state.gridCursor.cursor.y * config.TILE_SIZE,
                width: config.TILE_SIZE,
                height: config.TILE_SIZE,
            },
            { x: 0, y: 0 },
            0,
            r.WHITE);

        // current sprite tile at cursor
        const { texture, rect } = resources.getSpriteAtIndex(this.activeSpriteIndex)
        r.DrawTexturePro(
            texture,
            rect,
            { 
                x: state.gridCursor.mouse.x,
                y: state.gridCursor.mouse.y,
                width: config.TILE_SIZE,
                height: config.TILE_SIZE,
            },
            { x: 0, y: 0 },
            0,
            r.WHITE)
    }
}