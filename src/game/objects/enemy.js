import r from 'raylib'
import GameObject from './game_object.js'
import resources from '../../game_resources.js';
import config from '../../game_config.js';

export default class Enemy extends GameObject {
    constructor(position, width, height, color) {
        super(position, r.Vector2(0, 0), width, height, color);
        this.speed = 10;
        this.scale = 0.8;
        this.health = 10
        this.spriteName = 'skeleton_humanoid';
        this.target = {
            x: config.WIDTH / 2,
            y: config.HEIGHT / 2,
        }
    }

    update(dt) {
        const diffVector = {
            x: this.target.x - this.position.x,
            y: this.target.y - this.position.y,
        }

        // Normalize
        const normalized = r.Vector2(0,0)
        const length = Math.sqrt(Math.pow(diffVector.x, 2) + Math.pow(diffVector.y, 2))
        if (length != 0) {
            normalized.x = diffVector.x / length
            normalized.y = diffVector.y / length
        }

        this.velocity.x = normalized.x * this.speed
        this.velocity.y = normalized.y * this.speed

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