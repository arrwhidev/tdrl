import r from 'raylib'
import Enemy from './enemy.js'
import state from '../game_state.js'

export default class EnemyEmitter {

    constructor(capacity, maxAlive) {
        this.position = r.Vector2(0, 30);
        this.capacity = capacity; // total enemies that this emitter can emit
        this.maxAlive = maxAlive; // total enemies that are allowed to be alive
        this.enemies = []
        this.spawnTimer = 0
        this.spawnRate = 0.5
    }

    update(dt) {
        this.spawnTimer += dt;

        if (this.spawnTimer >= this.spawnRate) {
            this.spawnTimer = 0;
            if (this.enemies.length < this.maxAlive && this.capacity > 0) {
                this.capacity--;
                this.enemies.push(new Enemy({
                    x: this.position.x,
                    y: this.position.y,
                }, 5, 5, r.BLACK))
            }
        }

        this.enemies.forEach(enemy => {
            enemy.update(dt);
            if (enemy.health <= 0) {
                state.addCoins(1)
            }
        });
        this.enemies = this.enemies.filter(enemy => enemy.health > 0);
    }

    render() {
        this.enemies.forEach(enemy => {
            enemy.render()
        });
    }
}