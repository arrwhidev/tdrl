import * as r from 'raylib'
import GameObject from './game_object.js'
import Projectile from './projectile.js'
import state from '../../game_state.js'
import config from '../../game_config.js'
import resources from '../../game_resources.js'
import { angleBetweenPoints } from '../../math.js'

export default class Tower extends GameObject {

    angle: number
    shootTimer: number
    shootRate: number
    reach: number
    target: GameObject
    
    constructor(position: r.Vector2) {
        super({
            position,
            width: config.TILE_SIZE,
            height: config.TILE_SIZE,
            spriteName: 'tower2',
        })

        this.angle = 0
        this.shootTimer = 0
        this.shootRate = 1
        this.reach = 50
        this.target = null
    }

    update(dt) {
        this.shootTimer += dt;
        this.color = r.WHITE;

        // Try to find a target if there isn't one
        if (!this.target) {
            // Check for enemies within the tower's radius
            for(let i = 0; i < state.enemyEmitters.length; i++) {
                const enemyEmitter = state.enemyEmitters[i];
                for (let j = 0; j < enemyEmitter.enemies.length; j++) {
                    const enemy = enemyEmitter.enemies[j];
                    if (r.CheckCollisionCircleRec(
                        this.getCenter(), this.reach, enemy.rect())) {
                            this.target = enemy;
                            break;
                    }
                }
            }
        }

        if (this.target) {
            // check if enemy is still in reach
            if (!r.CheckCollisionCircleRec(this.position, this.reach, this.target.rect())) {
                this.target = null;
                return;
            }
            this.color = r.GREEN;

            // enemy is within reach!
            
            // rotate towards it
            const targetAngle = angleBetweenPoints(this.target.position, this.position)
            if (targetAngle < this.angle) {
                this.angle--;
            } else if (targetAngle > this.angle) {
                this.angle++;
            }

            // attack it
            if (this.shootTimer >= this.shootRate) {
                this.shootTimer = 0;
                const turretPosition = this.getTurretPosition()
                state.projectiles.push(
                    new Projectile({
                        x: turretPosition.x,
                        y: turretPosition.y,
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
                x: this.position.x * this.scale,
                y: this.position.y * this.scale,
                width: this.width * this.scale,
                height: this.height * this.scale,
            },
            { x: 0, y: 0 },
            0,
            r.WHITE)

        // rotating turret
        const turretPosition = this.getTurretPosition()
        r.DrawRectanglePro(
            {
                x: turretPosition.x,
                y: turretPosition.y,
                width: 10,
                height: 2,
            },
            { x: 0, y: 0 },
            this.angle,
            r.BROWN
        )
        
        // tower reach

        if(state.debug) {
            const center = this.getCenter()

            // reach
            r.DrawCircleLines(center.x, center.y, this.reach, {...this.color, a: 150})

            // center dot
            r.DrawCircle(center.x, center.y, 1, r.GREEN)

            const rect = this.rect()
            r.DrawRectangleLines(rect.x, rect.y, rect.width, rect.height, r.GREEN)
        }
    }

    getTurretPosition() {
        return {
            x: this.position.x + (this.width / 2 * this.scale),
            y: this.position.y * this.scale
        }
    }
}