import r from 'raylib'
import GameObject from './game_object.js'
import Projectile from './projectile.js'
import state from '../../game_state.js'
import config from '../../game_config.js'
import resources from '../../game_resources.js'
import {
    RAD2DEG,
    euclideanDistance,
} from '../../math.js'

export default class Tower extends GameObject {
    constructor(position) {
        super(position)
        this.width = config.TILE_SIZE
        this.height = config.TILE_SIZE
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
        if (!this.target) {
            // Check for enemies within the tower's radius
            for(let i = 0; i < state.enemyEmitters.length; i++) {
                const enemyEmitter = state.enemyEmitters[i];
                for (let j = 0; j < enemyEmitter.enemies.length; j++) {
                    const enemy = enemyEmitter.enemies[j];
                    const distance = euclideanDistance(
                        this.position.x, 
                        this.position.y, 
                        enemy.position.x,
                        enemy.position.y);
                    if (distance <= this.reach) {
                        this.target = enemy;
                        break;
                    }
                }
            }
        }

        if (this.target) {
            // check if enemy is still in reach
            const distance = euclideanDistance(
                this.position.x, 
                this.position.y, 
                this.target.position.x,
                this.target.position.y);
            if (distance > this.reach) {
                this.target = null;
                return;
            }

            // enemy is within reach.
            
            // rotate towards it
            let dx = this.target.position.x - this.position.x;
            let dy = this.target.position.y - this.position.y;
            const targetAngle = Math.atan2(dy, dx) * RAD2DEG;
            if (targetAngle < this.angle) {
                this.angle--;
            } else if (targetAngle > this.angle) {
                this.angle++;
            }

            // attack it
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
        // sprite
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

        // rotating turret
        r.DrawRectanglePro(
            {
                x: this.position.x + (this.width / 2),
                y: this.position.y,
                width: 10,
                height: 2,
            },
            { x: 0, y: 0 },
            this.angle,
            r.BROWN
        )
            
        r.DrawCircleLines(this.position.x, this.position.y, this.reach, {...r.WHITE, a: 100})
    }
}