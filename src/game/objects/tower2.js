import r from 'raylib'
import GameObject from './game_object.js'
import Projectile from './projectile.js'
import state from '../game_state.js'
import {
    RAD2DEG,
    euclideanDistance,
} from '../math.js'

export default class Tower extends GameObject {
    constructor(position) {
        super(position)
        this.angle = 0
        this.shootTimer = 0
        this.shootRate = 1
        this.reach = 50
        this.target = null
        this.scale = 1
        this.spriteName = 'tower2'
    }

    update(dt) {
        this.shootTimer += dt;

        // Try to find a target if there isn't one
        // if (!this.target) {
        //     // Check for enemies within the tower's radius
        //     for (let i = 0; i < state.enemyEmitter.enemies.length; i++) {
        //         const enemy = state.enemyEmitter.enemies[i];
        //         const distance = euclideanDistance(
        //             this.position.x, 
        //             this.position.y, 
        //             enemy.position.x,
        //             enemy.position.y);
        //         if (distance <= this.reach) {
        //             this.target = enemy;
        //             break;
        //         }
        //     }
        // }
        
        if (this.target) {
            let dx = this.target.position.x - this.position.x;
            let dy = this.target.position.y - this.position.y;
            this.angle = Math.atan2(dy, dx) * RAD2DEG;

            if (this.shootTimer >= this.shootRate) {
                this.shootTimer = 0;
                state.projectiles.push(
                    new Projectile({
                        x: this.position.x,
                        y: this.position.y,
                    }, this.angle)
                )
            }
        }
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
            this.angle,
            r.WHITE)
            
        r.DrawCircleLines(this.position.x, this.position.y, this.reach, {...r.WHITE, a: 100})
    }
}