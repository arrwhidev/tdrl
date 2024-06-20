class GameState {
    constructor() {
        this.debug = false
        this.player = {
            coins: 0
        }
        this.camera = false
        this.hud = false
        this.grid = false
        this.tower = false
        this.enemyEmitter = false
        this.shooters = []
        this.projectiles = []
    }

    addCoins(n) {
        this.player.coins += n
    }
}

const state = new GameState();
export default state;