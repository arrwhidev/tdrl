// import * as r from 'raylib'
// import GameObject from './game_object.js'
// import resources from '../../game_resources.js';
// import state from '../../game_state.js';
// import config from '../../game_config.js';
// import { astar } from '../pathfinding.js';

// export default class Guy extends GameObject {

//     constructor(gridPosition, width, height, color) {
//         super({
//             x: gridPosition.x * config.TILE_SIZE,
//             y: gridPosition.y * config.TILE_SIZE,
//         }, r.Vector2(0, 0), width, height, color);

//         this.gridPosition = gridPosition;
//         this.speed = 40;
//         this.scale = 1;
//         this.health = 10;
//         this.spriteName = 'dwarf_male';
//         this.grid = state.map.data;
//         this.path = []
//     }

//     findClosestOre() {
//         // TODO
//         // This is not accurate and will not actually find the closest ore.
//         // BUT, it is probably good enough for now.
//     }

//     setTarget(target) {
//         this.target = target
//         this.calculatePath(this.target)
//     }

//     calculatePath(target) {
//         this.path = astar(this.grid, this.gridPosition, target)
//     }

//     update(dt) {
//         if (this.path.length > 0) {
//             const roundedX = Math.round(this.position.x)
//             const roundedY = Math.round(this.position.y)

//             this.gridPosition.x = roundedX / config.TILE_SIZE
//             this.gridPosition.y = roundedY / config.TILE_SIZE

//             const nextTile = this.path[0]
//             const nextTileX = nextTile.x * config.TILE_SIZE
//             const nextTileY = nextTile.y * config.TILE_SIZE

//             // if we have reached the target tile, shift to next
//             if (roundedX === nextTileX && roundedY === nextTileY) {
//                 this.path.shift()
//                 return
//             }

//             if (this.grid[nextTile.y][nextTile.x].layers[0].walkable) {  // Ensure the next step is still walkable
//                 const diffVector = {
//                     x: nextTileX - this.position.x,
//                     y: nextTileY - this.position.y,
//                 }
        
//                 const normalized = r.Vector2(0,0)
//                 const length = Math.sqrt(Math.pow(diffVector.x, 2) + Math.pow(diffVector.y, 2))
//                 if (length != 0) {
//                     normalized.x = diffVector.x / length
//                     normalized.y = diffVector.y / length
//                 }
        
//                 this.velocity.x = normalized.x * this.speed
//                 this.velocity.y = normalized.y * this.speed
        
//                 this.position.x += this.velocity.x * dt;
//                 this.position.y += this.velocity.y * dt;
//             } else {
//                 this.calculatePath(this.target)
//             }
//         }
//     }

//     render() {
//         let { texture, rect } = resources.getSprite(this.spriteName);
//         r.DrawTexturePro(
//             texture,
//             rect,
//             { 
//                 x: this.position.x,
//                 y: this.position.y,
//                 width: this.width * this.scale,
//                 height: this.height * this.scale,
//             },
//             { x: 0, y: 0 },
//             0,
//             r.WHITE)
        
//         if (state.debug) {
//             // draw path
//             for (let i = 0; i < this.path.length; i++) {
//                 const prev = this.path[i-1];
//                 const now = this.path[i];
//                 if (prev && now) {
//                     r.DrawLine(
//                         prev.x * config.TILE_SIZE, prev.y * config.TILE_SIZE, now.x * config.TILE_SIZE, now.y * config.TILE_SIZE, r.GREEN
//                     )
//                 }
//             }
            
//             // draw bounding rect
//             const rect = this.rect()
//             r.DrawRectangleLines(rect.x, rect.y, rect.width, rect.height, r.GREEN)

//             // draw center
//             const center = this.getCenter()
//             r.DrawCircle(center.x, center.y, 1, r.GREEN)
//         }
//     }
// }