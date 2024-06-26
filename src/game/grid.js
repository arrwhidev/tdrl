import r from 'raylib'
import resources from '../game_resources.js'
import config from '../game_config.js'
import state from '../game_state.js'
import { Map } from '../map.js'

export default class Grid {
    constructor(mapName) {
        this.camera = state.camera.game;
        this.mapName = mapName

        const rawMap = resources.getMap(mapName)
        this.map = new Map(mapName, rawMap)

        this.renderGridLines = false
        this.renderLayers = new Array(true, true)
    }

    update(dt) {
        // zoom
        if (r.GetMouseWheelMove() != 0) {
            state.camera.game.zoom += r.GetMouseWheelMove() * config.ZOOM_SPEED
        }

        // pan right
        if (r.GetMouseX() > config.WIDTH * config.SCALING_FACTOR) {
            const minOffset = -(this.map.getNumCols() * config.TILE_SIZE - config.WIDTH);
            if (state.camera.game.offset.x <= minOffset) {
                state.camera.game.offset.x = minOffset
            } else {
                state.camera.game.offset.x -= 1
            }
        }

        // pan left
        if (r.GetMouseX() < 0) {
            if (state.camera.game.offset.x >= 0) {
                state.camera.game.offset.x = 0
            } else {
                state.camera.game.offset.x += 1    
            }
        }
        
        // pan down
        if (r.GetMouseY() > config.HEIGHT * config.SCALING_FACTOR) {
            const minOffset = -(this.map.getNumRows() * config.TILE_SIZE - config.HEIGHT);
            if (state.camera.game.offset.y <= minOffset) {
                state.camera.game.offset.y = minOffset
            } else {
                state.camera.game.offset.y -= 1
            }
        }

        // pan up
        if (r.GetMouseY() < 0) {
            if (state.camera.game.offset.y >= 0) {
                state.camera.game.offset.y = 0
            } else {
                state.camera.game.offset.y += 1    
            }
        }
        
        // Keyboard
        if(r.IsKeyPressed(r.KEY_EQUAL)) {
            state.camera.game.zoom += config.ZOOM_SPEED
        } else if(r.IsKeyPressed(r.KEY_MINUS)) {
            state.camera.game.zoom -= config.ZOOM_SPEED
        } else if(r.IsKeyPressed(r.KEY_DOWN)) {
            state.camera.game.offset.y -= 4
        } else if(r.IsKeyPressed(r.KEY_RIGHT)) {
            state.camera.game.offset.x -= 4
        } else if(r.IsKeyPressed(r.KEY_UP)) {
            state.camera.game.offset.y += 4
        } else if(r.IsKeyPressed(r.KEY_LEFT)) {
            state.camera.game.offset.x += 4
        } 
    }

    render() {
        // grid sprites
        for (let layer = 0; layer < this.map.getNumLayers(); layer++) {
            if (!this.renderLayers[layer]) continue;

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
        if (this.renderGridLines) {
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
        }
    }
}