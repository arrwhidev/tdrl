import r from 'raylib'
import Enemy from './enemy.js'
import config from '../../game_config.js';
import state from '../../game_state.js';

export default class EnemyEmitter {

    constructor(capacity = 10, maxAlive = 10) {
        this.capacity = capacity; // total enemies that this emitter can emit
        this.maxAlive = maxAlive; // total enemies that are allowed to be alive
        this.spawnTimer = 0
        this.spawnRate = 0.2
        this.enemies = []
    }

    update(dt) {
        this.spawnTimer += dt;

        if (this.spawnTimer >= this.spawnRate) {
            this.spawnTimer = 0;
            if (this.enemies.length < this.maxAlive && this.capacity > 0) {
                this.capacity--;

                const enemy = this.createEnemy();
                if (enemy) {
                    this.enemies.push(enemy);
                }
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

    createEnemy() {
        let x, y;

        // choose a random side
        // top (0), bottom (1), left (2), right (3)
        const side = r.GetRandomValue(0, 4);
        const maxY = state.grid.map.getNumRows()
        const maxX = state.grid.map.getNumCols()
        const buffer = 0

        if (side === 0) { // top
            x = r.GetRandomValue(0, maxX)
            y = 0 - buffer
        } else if (side === 1) { // bottom
            x = r.GetRandomValue(0, maxX)
            y = maxY + buffer
        } else if (side === 2) { // left
            x = 0 - buffer
            y = r.GetRandomValue(0, maxY)
        } else if (side === 3) { // right
            x = maxX + buffer
            y = r.GetRandomValue(0, maxY)
        }
        console.log('create enemy at ', x, y)
        return new Enemy({ x, y }, 20, 20);
    }
}