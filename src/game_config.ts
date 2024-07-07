class GameConfig {
    
    WIDTH: number
    HEIGHT: number
    SCALING_FACTOR: number
    TILE_SIZE: number
    NUM_ROWS: number
    NUM_COLS: number
    FONT_SIZE: number
    ZOOM_SPEED: number

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