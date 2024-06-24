import r from 'raylib'
import GameObject from './game_object.js'
import resources from '../../game_resources.js';

export default class Enemy extends GameObject {
    constructor(position, width, height, color) {
        super(position, r.Vector2(3, 1), width, height, color);
        this.speed = 30;
        this.scale = 0.8;
        this.spriteName = 'skeleton_humanoid';
    }

    update(dt) {
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }

    render() {
        let { texture, rect } = resources.getSprite(this.spriteName);
        r.DrawTexturePro(
            texture,
            rect,
            { 
                x: this.position.x,
                y: this.position.y,
                width: this.width * this.scale,
                height: this.height * this.scale,
            },
            { x: 0, y: 0 },
            0,
            r.WHITE)
    }

    rect() {
        return {
            x: this.position.x - this.width,
            y: this.position.y - this.height,
            width: this.width * 2,
            height: this.height * 2,
        }
    }
}