import * as r from 'raylib'
import state from '../../game_state.js'
import config from '../../game_config.js'
import { Vec2 } from '../../math.js';

export interface GameObjectConfig {
    position?: r.Vector2;
    velocity?: r.Vector2;
    width?: number;
    height?: number;
    scale?: number;
    speed?: number;
    color?: r.Color;
    spriteName?: string;
}

export default abstract class GameObject {

    position: r.Vector2; // always represents topleft
    velocity: r.Vector2;
    width: number;
    height: number;
    scale: number;
    speed: number;
    color: r.Color;
    spriteName: string;
    camera: r.Camera2D;

    constructor(config: GameObjectConfig) {
        this.position = config.position || Vec2(0, 0);
        this.velocity = config.velocity || Vec2(0, 0);
        this.width = config.width || 0;
        this.height = config.height || 0;
        this.scale = config.scale || 1;
        this.speed = config.speed || 30;
        this.color = config.color || r.PINK;
        this.spriteName = config.spriteName || null;
    }

    abstract update(dt);
    abstract render();

    rect(): r.Rectangle {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width * this.scale,
            height: this.height * this.scale,
        }
    }

    getCenter(): r.Vector2 {
        return {
            x: this.getCenterX(),
            y: this.getCenterY(),
        }
    }

    getCenterX() {
        return this.position.x + this.width / 2 * this.scale
    }

    getCenterY() {
        return this.position.y + this.height / 2 * this.scale
    }
}