// import * as r from 'raylib';
// import Enemy from './enemy.js'
// import Tower from './tower.js'
// import GameObject from './game_object.js';

// export default class HealthBar extends GameObject {

//     constructor(obj) {
//         this.obj = obj
//     }

//     update(dt) {

//     }

//     render() {
//         if (this.obj instanceof Enemy) {
//             r.DrawRectangleLines(this.obj.position.x - this.obj.width, this.obj.position.y - this.obj.height - 5, this.obj.width * 2, 3, r.BLACK)
//             r.DrawRectangle(this.obj.position.x - this.obj.width, this.obj.position.y - this.obj.height - 5, (this.obj.health / this.obj.maxHealth) * this.obj.width * 2, 3, r.RED)
//         } else if (this.obj instanceof Tower) {
//             r.DrawRectangleLines(this.obj.position.x, this.obj.position.y - 10, this.obj.width, 5, r.BLACK)
//             r.DrawRectangle(this.obj.position.x, this.obj.position.y - 10, (this.obj.health / this.obj.maxHealth) * this.obj.width, 5, r.RED)
//         }
//     }
// }