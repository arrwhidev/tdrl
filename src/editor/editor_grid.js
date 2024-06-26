import r from 'raylib'
import resources from '../game_resources.js'
import config from '../game_config.js'
import state from '../game_state.js'
import Grid from '../game/grid.js'

export default class EditorGrid extends Grid {
    constructor(mapName) {
        super(mapName)
        this.renderGridLines = true
        this.activeSpriteIndex = 0
        this.activeLayerIndex = 0
    }

    update(dt) {
        super.update(dt);

        // Mouse
        if (r.GetMouseWheelMove() != 0) {
            state.camera.game.zoom += r.GetMouseWheelMove() * config.ZOOM_SPEED
        } else if (r.IsMouseButtonDown(r.MOUSE_BUTTON_LEFT)) {
            const row = state.gridCursor.cursor.y
            const col = state.gridCursor.cursor.x
            const layer = this.activeLayerIndex
            const spriteName = resources.getSpriteNameAtIndex(this.activeSpriteIndex)
            const tileLayer = this.map.getTileLayer(row, col, layer);
            if (tileLayer) {
                tileLayer.setSpriteName(spriteName)
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
        } else if (r.IsKeyPressed(r.KEY_V)) {
            this.renderLayers[this.activeLayerIndex] = !this.renderLayers[this.activeLayerIndex];
        }
    }

    render() {
        super.render()

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