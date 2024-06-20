class GameConfig {
    constructor() {
        // dimensions
        this.WIDTH          = 320
        this.HEIGHT         = 240
        this.SCALING_FACTOR = 3

        // tiles
        this.TILE_SIZE = 20
        this.NUM_ROWS  = this.HEIGHT / this.TILE_SIZE;
        this.NUM_COLS  = this.WIDTH / this.TILE_SIZE;

        // ui
        this.FONT_SIZE = 12.2;
    }
}

const config = new GameConfig();
Object.freeze(config);
export default config;