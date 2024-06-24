class GameConfig {
    constructor() {
        // dimensions
        this.WIDTH          = 640
        this.HEIGHT         = 480
        this.SCALING_FACTOR = 2

        // grid
        this.TILE_SIZE = 20
        this.NUM_ROWS  = 20
        this.NUM_COLS  = 30

        // ui
        this.FONT_SIZE = 12.2;

        //
        this.ZOOM_SPEED = 0.05;
    }
}

const config = new GameConfig();
Object.freeze(config);
export default config;