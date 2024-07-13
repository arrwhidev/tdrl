import * as r from 'raylib'
import state from "../game_state";
import Projectile from "./objects/projectile";
import Enemy from './objects/enemy';

export function checkCollisions() {
    // Check projectile vs enemy
    state.enemyEmitters.forEach(ee => {
        ee.enemies.forEach((enemy: Enemy) => {
            state.projectiles.forEach((projectile: Projectile) => {
                if(r.CheckCollisionRecs(enemy.rect(), projectile.rect())) {
                    enemy.takeDamage(projectile.getDamage());
                    projectile.reduceHits();
                }
            })
        })
    })
}