export const MODE_PLAY            = 0;
export const MODE_LVL_UP          = 1;
export const MODE_UPGRADE_SHOOTER = 2;
export const MODE_CREATE_SHOOTER  = 3;

class GameState {
    constructor() {
        this.player = {
            coins: 0
        }
        this.mode = MODE_PLAY;
        this.debug = false
        this.camera = {}
        this.hud = false
        this.grid = false
        this.gridCursor = false
        this.tower = false
        this.enemyEmitter = false
        this.healthBars = []
        this.shooters = []
        this.projectiles = []
        this.levelUpUI = false
    }

    addCoins(n) {
        this.player.coins += n
    }

    setMode(mode) {
        this.mode = mode;
    }
}

const state = new GameState();
export default state;