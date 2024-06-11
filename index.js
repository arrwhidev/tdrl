const r = require('raylib')

// math consts

const RAD2DEG = 180 / Math.PI;

// constants

const WIDTH          = 320
const HEIGHT         = 240
const SCALING_FACTOR = 3
const WAYPOINTS = [
    { x: 30, y: 43 },
    { x: 44, y: 191 },
    { x: 75, y: 207 },
    { x: 114, y: 187 },
    { x: 124, y: 127 },
    { x: 122, y: 66 },
    { x: 147, y: 40 },
    { x: 195, y: 48 },
    { x: 206, y: 103 },
    { x: 198, y: 182 },
    { x: 221, y: 210 },
    { x: 265, y: 200 },
    { x: 278, y: 130 },
    { x: 275, y: 43 }
]

// variables

let debug = false
let tower;
let enemyEmitter
let shooters

// game

r.InitWindow(WIDTH * SCALING_FACTOR, HEIGHT * SCALING_FACTOR, "tdrl")
r.SetTargetFPS(60)

const camera = r.Camera2D(r.Vector2(0, 0), r.Vector2(0, 0), 0, 1)
const tex = r.LoadRenderTexture(WIDTH, HEIGHT)
const bg = r.LoadTexture('./bg.png')

class GameObject {
    constructor(position, width, height, color) {
        this.position = position || r.Vector2(0, 0);
        this.width = width || 0;
        this.height = height || 0;
        this.color = color || r.BLACK;
    }

    update(dt) {

    }

    render() {

    }

    rect() {
        return {
            x: this.position.x, 
            y: this.position.y,
            width: this.width,
            height: this.height,
        }
    }
}

class Enemy extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color)
        this.waypointIndex = 0;
        this.health = 20;
        this.maxHealth = this.health;
    }

    update(dt) {
        const wpx = WAYPOINTS[this.waypointIndex].x;
        const wpy = WAYPOINTS[this.waypointIndex].y;
    
        // Calculate the distance to the current waypoint
        const distanceToWaypoint = Math.sqrt(
            Math.pow((wpx - this.position.x), 2) + 
            Math.pow((wpy - this.position.y), 2));
    
        // Define a small threshold to consider the element has reached the waypoint
        const threshold = 1;
    
        // move towards waypoint
        if (this.position.x < wpx) {
            this.position.x++;
        } else if (this.position.x > wpx) {
            this.position.x--;
        }
    
        if (this.position.y < wpy) {
            this.position.y++;
        } else if (this.position.y > wpy) {
            this.position.y--;
        }
    
        // Update waypoint when reach it (consider the threshold)
        if (distanceToWaypoint < threshold && this.waypointIndex < WAYPOINTS.length - 1) {
            // this.waypointIndex = (this.waypointIndex + 1) % WAYPOINTS.length;
            this.waypointIndex++;
        }
    }

    render() {
        r.DrawCircle(this.position.x, this.position.y, this.width, this.color)

        // health bar
        r.DrawRectangleLines(this.position.x - this.width, this.position.y - this.height - 10, this.width * 2, 3, r.BLACK)
        r.DrawRectangle(this.position.x - this.width, this.position.y - this.height - 10, (this.health / this.maxHealth) * this.width * 2, 3, r.RED)

        if (debug) {
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

class EnemyEmitter {

    constructor(position, capacity, maxAlive) {
        this.position = position;
        this.capacity = capacity; // total enemies that this emitter can emit
        this.maxAlive = maxAlive; // total enemie that are allowed to be alive
        this.enemies = [];
        this.spawnTimer = 0;
    }

    update(dt) {
        this.spawnTimer += dt;

        if (this.spawnTimer >= 1) {
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
        });
        this.enemies = this.enemies.filter(enemy => enemy.health > 0);
    }

    render() {
        this.enemies.forEach(enemy => {
            enemy.render()
        });
    }
}

class Shooter extends GameObject {

    constructor(position) {
        super(position)
        this.angle = 0
    }

    update(dt) {
        if(r.IsKeyDown(r.KEY_LEFT)) {
            this.angle -= 1
        }
        if (r.IsKeyDown(r.KEY_RIGHT)) {
            this.angle += 1
        }

        // TODO: smarter logic to detect target
        let target
        if (enemyEmitter.enemies.length > 0) {
            target = {}
            target.x = enemyEmitter.enemies[0].position.x
            target.y = enemyEmitter.enemies[0].position.y
        }

        if (target) {
            let dx = target.x - this.position.x;
            let dy = target.y - this.position.y;
            this.angle = Math.atan2(dy, dx) * RAD2DEG;
        }
    }

    render() {
        const rect = {
            x: this.position.x,
            y: this.position.y,
            width: 10,
            height: 2,
        }
        r.DrawRectanglePro(
            rect,
            { x: 0, y: 0 },
            this.angle,
            r.BROWN
        )
        r.DrawCircle(this.position.x, this.position.y, 5, r.BROWN)
    }
}

class Tower extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color)
        this.health = 100
        this.maxHealth = 100
    }

    update(dt) {

    }

    render() {
        // Render tower
        r.DrawRectangle(this.position.x, this.position.y, this.width, this.height, this.color)

        // Render health bar
        r.DrawRectangleLines(this.position.x, this.position.y - 10, this.width, 5, r.BLACK)
        r.DrawRectangle(this.position.x, this.position.y - 10, (this.health / this.maxHealth) * this.width, 5, r.RED)

        if (debug) {
            const rect = this.rect();
            r.DrawRectangleLines(rect.x, rect.y, rect.width, rect.height, r.GREEN)
        }
    }
}

tower = new Tower({ x: 262, y: 35 }, 25, 25, r.GRAY)
enemyEmitter = new EnemyEmitter(r.Vector2(0, 42), 10, 3)
shooters = []

while (!r.WindowShouldClose()) {
    const dt = r.GetFrameTime()

    // Debug
    if (r.IsKeyPressed(r.KEY_D)) {
        debug = !debug;
    }

    if (r.IsMouseButtonPressed(r.MOUSE_BUTTON_LEFT)) {
        const mouse = r.GetMousePosition()
        const shooter = new Shooter({x: mouse.x / SCALING_FACTOR, y: mouse.y / SCALING_FACTOR })
        shooters.push(shooter)
    }

    // Update
    tower.update(dt);
    enemyEmitter.update(dt);
    shooters.forEach(shooter => shooter.update(dt))

    // Collision checks
    enemyEmitter.enemies.forEach(enemy => {
        if (r.CheckCollisionRecs(tower.rect(), enemy.rect())) {
            tower.health = tower.health - 1;
        }
    })

    // Render game objects to texture at internal resolution
    r.BeginTextureMode(tex)
    r.ClearBackground(r.RAYWHITE)

    r.BeginMode2D(camera)
    r.DrawTexture(bg, 0, 0, r.WHITE)
        tower.render()
        enemyEmitter.render()
        shooters.forEach(shooter => shooter.render())
    r.EndTextureMode()

    // Render the texture and scale it
    r.BeginDrawing()
    r.ClearBackground(r.RAYWHITE);
        r.DrawTexturePro(
            tex.texture,
            { x:0, y:0, width: tex.texture.width, height: -tex.texture.height },
            { x:0, y:0, width: tex.texture.width * SCALING_FACTOR, height: tex.texture.height * SCALING_FACTOR },
            { x:0, y:0 },
            0.0,
            r.WHITE);
    r.EndDrawing();
}
r.CloseWindow()