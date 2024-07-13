import state from "../game_state";

export function cleanGameObjects() {
    // enemies
    state.enemyEmitters.forEach(ee => { 
        ee.enemies = ee.enemies.filter(enemy => enemy.isAlive());
    });
    
    // projectiles
    if (state.projectiles.length > 0) {
        state.projectiles = state.projectiles.filter(p => p.alive)
    }
}