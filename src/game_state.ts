import * as r from 'raylib'
import Tower from './game/objects/tower.js'
import { Map } from './map.js';
import Grid from './game/grid.js';
import EnemyEmitter from './game/objects/enemy_emitter.js';
import Projectile from './game/objects/projectile.js';
import GameObject from './game/objects/game_object.js';
import Hud from './game/ui/hud.js';
import GridCursor from './grid_cursor.js';

const MODE_PLAY  = 0;
const MODE_PAUSE = 1;

class GameState {

    mode: number;
    debug: boolean;
    map: Map;
    grid: Grid;

    hud: Hud;
    camera: any;
    
    gridCursor: GridCursor;
    
    towers: Tower[];
    projectiles: Projectile[];
    enemyEmitters: EnemyEmitter[];
    // guys: Guy[];
    
    constructor() {
        this.mode = MODE_PLAY
        this.debug = false
        this.camera = {}
        
        this.towers = []
        this.projectiles = []
        this.enemyEmitters = []
        // this.guys = []
    }

    // Game Objects

    getGameObjects(): GameObject[] {
        let arr = []
        for (let i = 0; i < this.enemyEmitters.length; i++) {
            arr.push(this.enemyEmitters[i]);
        }
        for (let i = 0; i < this.towers.length; i++) {
            arr.push(this.towers[i]);
        }
        for (let i = 0; i < this.projectiles.length; i++) {
            arr.push(this.projectiles[i]);
        }
        return arr
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
        return tileLayer?.walkable;
    }

    canCreateTower(row, col) {
        const tileLayer = this.map.getTileLayer(row, col, 0);
        return tileLayer?.canCreate('tower');
    }

    canCreateGuy(row, col) {
        const tileLayer = this.map.getTileLayer(row, col, 0);
        return tileLayer?.canCreate('guy');
    }
}

const state = new GameState();
export default state;