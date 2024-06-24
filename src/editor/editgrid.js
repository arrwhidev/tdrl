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
        this.map = new Map(mapName, rawMap)

        this.activeSpriteIndex = 0
        this.activeLayerIndex = 0
    }

    update(dt) {
        if(r.IsKeyPressed(r.KEY_EQUAL)) {
            state.camera.game.zoom += 0.05
        } else if(r.IsKeyPressed(r.KEY_MINUS)) {
            state.camera.game.zoom -= 0.05
        } else if(r.IsKeyPressed(r.KEY_DOWN)) {
            state.camera.game.offset.y -= 4
        } else if(r.IsKeyPressed(r.KEY_RIGHT)) {
            state.camera.game.offset.x -= 4
        } else if(r.IsKeyPressed(r.KEY_UP)) {
            state.camera.game.offset.y += 4
        } else if(r.IsKeyPressed(r.KEY_LEFT)) {
            state.camera.game.offset.x += 4
        } else if(r.IsKeyPressed(r.KEY_L)) {
            this.activeLayerIndex = (this.activeLayerIndex + 1) % this.map.getNumLayers()
        } else if(r.IsKeyPressed(r.KEY_P)) {
            this.activeSpriteIndex = (this.activeSpriteIndex + 1) % resources.spriteCount()
        } else if (r.IsKeyPressed(r.KEY_O)) {
            this.activeSpriteIndex = ((this.activeSpriteIndex - 1) + resources.spriteCount()) % resources.spriteCount()
        } else if (r.IsKeyPressed(r.KEY_C)) {
            const row = state.gridCursor.cursor.y
            const col = state.gridCursor.cursor.x
            const layer = this.activeLayerIndex
            this.map.getTileLayer(row, col, layer).spriteName = null
        } else if (r.IsKeyPressed(r.KEY_ENTER)) {
            this.map.persist();
        } else if (r.IsMouseButtonDown(r.MOUSE_BUTTON_LEFT)) {
            const row = state.gridCursor.cursor.y
            const col = state.gridCursor.cursor.x
            const layer = this.activeLayerIndex
            const spriteName = resources.getSpriteNameAtIndex(this.activeSpriteIndex)
            this.map.getTileLayer(row, col, layer).spriteName = spriteName
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
                            // on layer 0 render black if there is no sprite
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