// import * as r from 'raylib'
// import GameObject from './game_object.js'
// import HealthBar  from './health_bar.js'
// import state from '../game_state.js'

// export default class Base extends GameObject {
//     constructor(position, width, height, color) {
//         super(position, null, width, height, color)
//         this.health = 100
//         this.maxHealth = 100
//         state.healthBars.push(new HealthBar(this));
//     }

//     update(dt) {

//     }

//     render() {
//         // Render base
//         r.DrawRectangle(this.position.x, this.position.y, this.width, this.height, this.color)

//         // Render health bar
//         // r.DrawRectangleLines(this.position.x, this.position.y - 10, this.width, 5, r.BLACK)
//         // r.DrawRectangle(this.position.x, this.position.y - 10, (this.health / this.maxHealth) * this.width, 5, r.RED)

//         if (state.debug) {
//             const rect = this.rect();
//             r.DrawRectangleLines(rect.x, rect.y, rect.width, rect.height, r.GREEN)
//         }
//     }
// }