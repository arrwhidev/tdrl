import * as r from 'raylib'
import Tower from './game/objects/tower.js'
import { Map } from './map.js';
import Grid from './game/grid.js';

const MODE_PLAY  = 0;
const MODE_PAUSE = 1;

class GameState {
    addCoins(arg0: number) {
        throw new Error('Method not implemented.');
    }
    
    mode: number;
    debug: boolean;
    map: Map;
    grid: Grid;

    hud: any;
    camera: any;
    
    gridCursor: any;
    
    towers: any[];
    projectiles: any[];
    enemyEmitters: any[];
    guys: any[];
    
    constructor() {
        this.mode = MODE_PLAY
        this.debug = false
        this.camera = {}
        
        this.towers = []
        this.projectiles = []
        this.enemyEmitters = []
        this.guys = []
    }

    // Game Objects

    getGameObjects() {
        // Order matters
        return [
            this.enemyEmitters,
            this.guys,
            this.towers,
            this.projectiles
        ]
    }

    // Cameras

    getGameCamera(): r.Camera2D {
        return this.camera.game;
    }

    getHudCamera(): r.Camera2D {
        return this.camera.hud;
    }

    setGameCamera(camera: r.Camera2D) {
        this.camera.game = camera
    }

    setHudCamera(camera: r.Camera2D) {
        this.camera.hud = camera
    }

    // Game states

    togglePaused() {
        if (this.mode === MODE_PLAY) {
            this.mode = MODE_PAUSE;
        } else if (this.mode === MODE_PAUSE) {
            this.mode = MODE_PLAY;
        }
    }

    isPlaying() {
        return this.mode === MODE_PLAY
    }

    isPaused() {
        return this.mode === MODE_PAUSE
    }

    toggleDebug() {
        this.debug = !this.debug;
    }

    // Guys

    // createGuyAtCursor() {
    //     const { x, y } = this.gridCursor.cursor;
    //     if (this.canCreateGuy(y, x)) {
    //         const guy = new Guy({
    //             x: this.gridCursor.getCursorNormalizedX(),
    //             y: this.gridCursor.getCursorNormalizedY(),
    //         })
    //         console.log(`Creating guy at row: ${tower.position.y} col ${tower.position.x}`)
    //         this.guys.push(guy)
    //     } else {
    //         console.log(`Can't create guy at row: ${y} col ${x}`)
    //     }
    // }

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
            console.log(`Can't create tower at row: ${y} col ${x}`)
        }
    }

    isWalkable(row, col) {
        const tileLayer = this.map.getTileLayer(row, col, 0);
        return tileLayer.walkable;
    }

    canCreateTower(row, col) {
        const tileLayer = this.map.getTileLayer(row, col, 0);
        return tileLayer.canCreate('tower');
    }

    canCreateGuy(row, col) {
        const tileLayer = this.map.getTileLayer(row, col, 0);
        return tileLayer.canCreate('guy');
    }
}

const state = new GameState();
export default state;