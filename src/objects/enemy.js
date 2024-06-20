import r from 'raylib'
import GameObject from './game_object.js'
import state from '../game_state.js'
import config from '../game_config.js'
import { euclideanDistance } from '../math.js'

const WAYPOINTS = [
    { x: 0, y: 30 },
    { x: 30, y: 30 },
    { x: 30, y: 210 },
    { x: 90, y: 210 },
    { x: 90, y: 30 },
    { x: 150, y: 30 },
    { x: 150, y: 210 },
    { x: 250, y: 210 },
    { x: 250, y: 70 },
]

export default class Enemy extends GameObject {
    constructor(position, width, height, color) {
        super(position, r.Vector2(0,0), width, height, color);
        this.waypointIndex = 0;
        this.health = 4;
        this.damage = 2;
        this.speed = 30;
        this.maxHealth = this.health;
    }

    update(dt) {
        // Get current way point
        const waypoint = WAYPOINTS[this.waypointIndex]
        const threshold = 1;

        // Calculate the direction vector
        let directionX = waypoint.x - this.position.x;
        let directionY = waypoint.y - this.position.y;

        // Calculate the distance to the waypoint
        let distance = euclideanDistance(
            this.position.x, this.position.y, waypoint.x, waypoint.y
        );

        // Calculate the angle in radians to the waypoint
        let angle = Math.atan2(directionY, directionX);

        // Set velocity based on the angle and speed
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;

        // Update position based on velocity and deltaTime
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        // Update waypoint when reach it (consider the threshold)
        if (distance < threshold && this.waypointIndex < WAYPOINTS.length - 1) {
            this.waypointIndex++;
        }
    }

    render() {
        // projectile
        r.DrawCircle(this.position.x, this.position.y, this.width, this.color)

        // health bar
        r.DrawRectangleLines(this.position.x - this.width, this.position.y - this.height - 10, this.width * 2, 3, r.BLACK)
        r.DrawRectangle(this.position.x - this.width, this.position.y - this.height - 10, (this.health / this.maxHealth) * this.width * 2, 3, r.RED)

        if (state.debug) {
            const rect = this.rect();
            r.DrawRectangleLines(rect.x, rect.y, rect.width, rect.height, r.GREEN)

            // waypoint destination
            r.DrawLine(rect.x, rect.y, WAYPOINTS[this.waypointIndex].x, WAYPOINTS[this.waypointIndex].y, r.GREEN);
        }
    }

    rect() {
        return {
            x: this.position.x - this.width,
            y: this.position.y - this.height,
            width: this.width * 2,
            height: this.height * 2,
        }
    }
}