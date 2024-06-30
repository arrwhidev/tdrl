import Tower from './game/objects/tower2.js'
import config from './game_config.js';

export const MODE_PLAY  = 0;
export const MODE_PAUSE = 1;

/**
 * Returns grid position { row, col }
 */
export function positionToGrid(x, y) {
    return {
        row: y * config.TILE_SIZE,
        col: x * config.TILE_SIZE,
    }
}

/**
 * Returns absolute position { x, y }
 */
export function gridToPosition(row, col) {
    return {
        x: Math.floor(col / config.TILE_SIZE),
        y: Math.floor(row / config.TILE_SIZE),
    }
}

class GameState {
    constructor() {
        this.mode = MODE_PLAY
        this.debug = false

        this.player = {
            coins: 0
        }
        this.camera = {}
        
        this.hud = false
        this.grid = false
        this.gridCursor = false

        this.towers = []
        this.projectiles = []
        this.enemyEmitters = []
    }

    togglePaused() {
        if (this.mode === MODE_PLAY) {
            this.mode = MODE_PAUSE;
        } else if (this.mode === MODE_PAUSE) {
            this.mode = MODE_PLAY;
        }
    }

    toggleDebug() {
        this.debug = !this.debug;
    }

    // Towers

    createTowerAtCursor() {
        const { x, y } = this.gridCursor.cursor;
        if (this.canCreateTower(y, x)) {
            const tower = new Tower({
                x: this.gridCursor.getCursorNormalizedX(),
                y: this.gridCursor.getCursorNormalizedY(),
            })
            console.log(`Creating tower at row: ${tower.position.y} col ${tower.position.x}`)
            this.towers.push(tower)
        } else {
            console.warn(`Can't create tower at row: ${y} col ${x}`)
        }
    }

    isWalkable(row, col) {
        const tileLayer = this.grid.map.getTileLayer(row, col, 0);
        return tileLayer.walkable;
    }

    canCreateTower(row, col) {
        const tileLayer = this.grid.map.getTileLayer(row, col, 0);
        return tileLayer.canCreate('tower');
    }
}

const state = new GameState();
export default state;