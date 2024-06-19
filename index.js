const r = require('raylib')
const fs = require('fs')

// math consts

const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// constants

const WIDTH          = 320
const HEIGHT         = 240
const SCALING_FACTOR = 3
const TILE_SIZE      = 20
const NUM_ROWS       = HEIGHT / TILE_SIZE;
const NUM_COLS       = WIDTH / TILE_SIZE;
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

// variables

let debug = false
let tower
let enemyEmitter
let shooters = []
let projectiles = []
let grid

// init

r.InitWindow(WIDTH * SCALING_FACTOR, HEIGHT * SCALING_FACTOR, "tdrl")
r.SetTargetFPS(0) // uncapped

// game

const camera = r.Camera2D(r.Vector2(0, 0), r.Vector2(0, 0), 0, 1)
const tex = r.LoadRenderTexture(WIDTH, HEIGHT)

// load

const mapjson = JSON.parse(fs.readFileSync('map.json'));
const spritesheet = r.LoadTexture(mapjson.sprite_sheet);

// classes

class Grid {
    constructor() {
        this.cursor = r.Vector2(0, 0);
        
        // init grid
        // access via this.grid[row][col]
        this.grid = new Array(NUM_ROWS);
        for (let row = 0; row < NUM_ROWS; row++) {
            if (!this.grid[row]) {
                this.grid[row] = new Array(NUM_COLS);
            }
            for (let col = 0; col < NUM_COLS; col++) {
                const flatIndex = row * NUM_COLS + col;
                const spriteId = mapjson.map[flatIndex];
                const spriteRow = Math.floor(spriteId / mapjson.sprite_sheet_cols);
                const spriteCol = spriteId % mapjson.sprite_sheet_cols;
                this.grid[row][col] = {
                    flatIndex,
                    isFree: spriteId === 81,
                    sprite: {
                        id: spriteId,
                        rect: {
                            x: spriteCol * 16,
                            y: spriteRow * 16, 
                            width: 16,
                            height: 16,
                        }
                    }
                }
            }
        }
    }

    update(dt) {
        // cursor grid position
        const mouseX = r.GetMouseX() / SCALING_FACTOR;
        const mouseY = r.GetMouseY() / SCALING_FACTOR;
        this.cursor.x = Math.floor(mouseX / TILE_SIZE);
        this.cursor.y = Math.floor(mouseY / TILE_SIZE);
    }

    render() {
        // grid sprites
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                const g = this.grid[row][col];
                r.DrawTexturePro(
                    spritesheet, 
                    g.sprite.rect,
                    { 
                        x: col * TILE_SIZE,
                        y: row * TILE_SIZE,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                    },
                    { x: 0, y: 0 },
                    0,
                    r.WHITE)
            }
        }

        // grid lines
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                r.DrawRectangleLinesEx({
                    x: col * TILE_SIZE,
                    y: row * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                }, 1, { ...r.BLACK, a: 100 })
            }
        }

        // highlight cursor grid element
        const showCursorSelect = true;
        if (showCursorSelect) {
            let g = this.grid[this.cursor.y]
            if (g) {
                g = g[this.cursor.x]
                if (g) {
                    const color = g.isFree ? {...r.GREEN, a: 200} : {...r.RED, a: 200}
                    r.DrawRectangleLinesEx({
                        x: this.cursor.x * TILE_SIZE,
                        y: this.cursor.y * TILE_SIZE,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                    }, 1, color)
                }
            }
        }
    }
}

class GameObject {
    constructor(position, velocity, width, height, color) {
        this.position = position || r.Vector2(0, 0);
        this.velocity = velocity || null;
        this.width = width || 0;
        this.height = height || 0;
        this.color = color || r.BLACK;
    }

    update(dt) {}
    render() {}

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
        let distance = Math.sqrt(directionX ** 2 + directionY ** 2);
      

        // Calculate the angle to the waypoint
        let angle = Math.atan2(directionY, directionX); // Angle in radians

        // Set velocity based on the angle and speed
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;

        // Update position based on velocity and deltaTime
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

    
        // Update waypoint when reach it (consider the threshold)
        if (distance < threshold && this.waypointIndex < WAYPOINTS.length - 1) {
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
        });
        this.enemies = this.enemies.filter(enemy => enemy.health > 0);
    }

    render() {
        this.enemies.forEach(enemy => {
            enemy.render()
        });
    }
}

class Projectile extends GameObject {

    constructor(position, angle) {
        super(position)
        this.damage = 2
        this.width = 2
        this.speed = 200

        const radians = angle * DEG2RAD;
        this.velocity = {
            x: Math.cos(radians) * this.speed,
            y: Math.sin(radians) * this.speed,
        }
        this.alive = true
    }

    update(dt) {
        this.position.x += this.velocity.x * dt
        this.position.y += this.velocity.y * dt
    }

    render() {
        r.DrawCircle(this.position.x, this.position.y, this.width, r.WHITE)
    }

    kill() {
        this.alive = false
    }

    rect() {
        return {
            x: this.position.x, 
            y: this.position.y,
            width: this.width,
            height: this.width,
        }
    }
}

class Shooter extends GameObject {
    constructor(position) {
        super(position)
        this.angle = 0
        this.shootTimer = 0
        this.shootRate = 1
        this.reach = 50
    }

    update(dt) {
        this.shootTimer += dt;

        // TODO: smarter logic to detect target
        // let target
        // if (enemyEmitter.enemies.length > 0) {
        //     target = {}
        //     target.x = enemyEmitter.enemies[0].position.x
        //     target.y = enemyEmitter.enemies[0].position.y
        // }

        // Check for enemies within the tower's radius
        let target = null;
        for (let i = 0; i < enemyEmitter.enemies.length; i++) {
            let distance = calculateDistance(this.position.x, this.position.y, enemyEmitter.enemies[i].position.x, enemyEmitter.enemies[i].position.y);
            if (distance <= this.reach) {
                target = enemyEmitter.enemies[i];
                break;
            }
        }

        if (target) {
            let dx = target.position.x - this.position.x;
            let dy = target.position.y - this.position.y;
            this.angle = Math.atan2(dy, dx) * RAD2DEG;

            if (this.shootTimer >= this.shootRate) {
                this.shootTimer = 0;
                projectiles.push(
                    new Projectile({
                        x: this.position.x,
                        y: this.position.y,
                    }, this.angle)
                )
            }
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
        r.DrawCircleLines(this.position.x, this.position.y, this.reach, {...r.WHITE, a: 100})
    }
}

class Tower extends GameObject {
    constructor(position, width, height, color) {
        super(position, null, width, height, color)
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

grid = new Grid();
tower = new Tower({ x: 240, y: 60 }, 25, 25, r.GRAY)
enemyEmitter = new EnemyEmitter(WAYPOINTS[0], 1000, 200)

while (!r.WindowShouldClose()) {
    const dt = r.GetFrameTime()

    // process specific input

    // Debug
    if (r.IsKeyPressed(r.KEY_D)) {
        debug = !debug;
    }

    // Shooter create
    if (r.IsMouseButtonPressed(r.MOUSE_BUTTON_LEFT)) {
        let g = grid.grid[grid.cursor.y]
        if (g) {
            g = g[grid.cursor.x]
            if (g && g.isFree) {
                shooters.push(
                    new Shooter({
                        x: (grid.cursor.x * TILE_SIZE) + (TILE_SIZE / 2),
                        y: (grid.cursor.y * TILE_SIZE) + (TILE_SIZE / 2),
                    })
                )
                grid.grid[grid.cursor.y][grid.cursor.x].isFree = false;
            }
        }
    }

    // Update
    grid.update(dt)
    tower.update(dt)
    enemyEmitter.update(dt)
    shooters.forEach(shooter => shooter.update(dt))
    projectiles.forEach(p => p.update(dt))

    // Collision checks
    enemyEmitter.enemies.forEach(enemy => {
        if (r.CheckCollisionRecs(tower.rect(), enemy.rect())) {
            tower.health = tower.health - enemy.damage;
        }

        projectiles.forEach(p => {
            if (r.CheckCollisionRecs(p.rect(), enemy.rect())) {
                enemy.health = enemy.health - p.damage;
                p.kill()
            }
        })
    })
    projectiles = projectiles.filter(p => p.alive);

    // Render game objects to texture at internal resolution
    r.BeginTextureMode(tex)
    r.ClearBackground(r.RAYWHITE)

    r.BeginMode2D(camera)
        grid.render();
        tower.render()
        enemyEmitter.render()
        shooters.forEach(shooter => shooter.render())
        projectiles.forEach(p => p.render())
        r.DrawText(r.GetFPS()+"fps", 3, 3, 5, r.RAYWHITE)
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