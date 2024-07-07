import * as r from 'raylib'
import resources from '../game_resources.js'
import config from '../game_config.js'
import state from '../game_state.js'

// /**
//  * Returns grid position { row, col }
//  */
// export function positionToGrid(x, y) {
//     return {
//         row: y * config.TILE_SIZE,
//         col: x * config.TILE_SIZE,
//     }
// }

// /**
//  * Returns absolute position { x, y }
//  */
// export function gridToPosition(row, col) {
//     return {
//         x: Math.floor(col / config.TILE_SIZE),
//         y: Math.floor(row / config.TILE_SIZE),
//     }
// }

export default class Grid {

    renderGridLines: boolean
    renderLayers: boolean[]
    camera: r.Camera2D
    
    constructor() {
        this.renderGridLines = false
        this.renderLayers = [true, true]
        this.camera = state.getGameCamera()
    }

    update(dt) {
        // zoom
        if (r.GetMouseWheelMove() != 0) {
            state.getGameCamera().zoom += r.GetMouseWheelMove() * config.ZOOM_SPEED
        }

        // pan right
        if (r.GetMouseX() > config.WIDTH * config.SCALING_FACTOR) {
            const minOffset = -(state.map.getNumCols() * config.TILE_SIZE - config.WIDTH);
            if (state.getGameCamera().offset.x <= minOffset) {
                state.getGameCamera().offset.x = minOffset
            } else {
                state.getGameCamera().offset.x -= 1
            }
        }

        // pan left
        if (r.GetMouseX() < 0) {
            if (state.getGameCamera().offset.x >= 0) {
                state.getGameCamera().offset.x = 0
            } else {
                state.getGameCamera().offset.x += 1    
            }
        }
        
        // pan down
        if (r.GetMouseY() > config.HEIGHT * config.SCALING_FACTOR) {
            const minOffset = -(state.map.getNumRows() * config.TILE_SIZE - config.HEIGHT);
            if (state.getGameCamera().offset.y <= minOffset) {
                state.getGameCamera().offset.y = minOffset
            } else {
                state.getGameCamera().offset.y -= 1
            }
        }

        // pan up
        if (r.GetMouseY() < 0) {
            if (state.getGameCamera().offset.y >= 0) {
                state.getGameCamera().offset.y = 0
            } else {
                state.getGameCamera().offset.y += 1    
            }
        }
        
        // Keyboard
        if(r.IsKeyPressed(r.KEY_EQUAL)) {
            state.getGameCamera().zoom += config.ZOOM_SPEED
        } else if(r.IsKeyPressed(r.KEY_MINUS)) {
            state.getGameCamera().zoom -= config.ZOOM_SPEED
        } else if(r.IsKeyPressed(r.KEY_DOWN)) {
            state.getGameCamera().offset.y -= 4
        } else if(r.IsKeyPressed(r.KEY_RIGHT)) {
            state.getGameCamera().offset.x -= 4
        } else if(r.IsKeyPressed(r.KEY_UP)) {
            state.getGameCamera().offset.y += 4
        } else if(r.IsKeyPressed(r.KEY_LEFT)) {
            state.getGameCamera().offset.x += 4
        } 
        
        if (r.IsMouseButtonPressed(r.MOUSE_BUTTON_LEFT)) {
            state.createTowerAtCursor()
        }
    }

    render() {
        const map = state.map;

        // grid sprites
        for (let layer = 0; layer < map.getNumLayers(); layer++) {
            if (!this.renderLayers[layer]) continue;

            for (let row = 0; row < map.getNumRows(); row++) {
                for (let col = 0; col < map.getNumCols(); col++) {
                    const tileLayer = map.getTileLayer(row, col, layer)
                    if (tileLayer.spriteName !== null) {
                        let { texture, rect } = resources.getSprite(tileLayer.spriteName);
                        let scale = 1
                        if (tileLayer.spriteName === 'base') {
                            scale = 2
                        }
                        r.DrawTexturePro(
                            texture,
                            rect,
                            { 
                                x: col * config.TILE_SIZE,
                                y: row * config.TILE_SIZE,
                                width: config.TILE_SIZE * scale,
                                height: config.TILE_SIZE * scale,
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
            for (let row = 0; row < map.getNumRows(); row++) {
                for (let col = 0; col < map.getNumCols(); col++) {
                    r.DrawRectangleLinesEx({
                        x: col * config.TILE_SIZE,
                        y: row * config.TILE_SIZE,
                        width: config.TILE_SIZE,
                        height: config.TILE_SIZE,
                    }, 1, { ...r.WHITE, a: 100 })
                }
            }
        }

        // highlight cursor grid element
        let sprite;
        const { x, y } = state.gridCursor.cursor;
        if (state.canCreateTower(y, x)) {
            sprite = resources.getSprite('cursor')
        } else {
            sprite = resources.getSprite('cursor_red')
        }
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
    }
}