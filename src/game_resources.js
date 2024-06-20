import r from 'raylib'
import fs from 'fs'

class GameResources {
    load() {
        this.fontRegular = r.LoadFont("./resources/fonts/MinecraftRegular-Bmg3.otf")
        this.fontBold = r.LoadFont("./resources/fonts/MinecraftBold-nMK1.otf")

        this.mapjson = JSON.parse(fs.readFileSync('./resources/map.json'))
        this.spritesheet = r.LoadTexture(`./resources/spritesheets/${this.mapjson.sprite_sheet}`)
    }
}

const resources = new GameResources();
export default resources;