import r from 'raylib'
import fs from 'fs'
import path from 'path'

class GameResources {

    load() {
        console.log('loading resources...')
        let start = new Date();

        this.sprites = []
        this.spriteDict = {}
        this.spriteDict = JSON.parse(fs.readFileSync(`./resources/spritesheets/sprites.json`))
        for (let key in this.spriteDict) {
            const spriteConfig = this.spriteDict[key];
            this.spriteDict[key].texture = this.loadSpriteTexture(spriteConfig.resource)
            this.sprites.push(key)
        }

        this.fonts = {}
        this.fonts.regular = r.LoadFont("./resources/fonts/MinecraftRegular-Bmg3.otf")
        this.fonts.bold = r.LoadFont("./resources/fonts/MinecraftBold-nMK1.otf")

        this.music = {}
        this.music.bg = this.loadMusic('bg.wav')

        this.maps = {
            dungeon: this.loadMap('dungeon')
        }

        const diffMs = new Date().getTime() - start.getTime()
        console.log('finished loading resources, took ' + diffMs + 'ms');
    }

    // sprites

    loadSpriteTexture(spritePath) {
        return r.LoadTexture('./' + path.join('resources', 'spritesheets', spritePath))
    }

    getSprite(name) {
        return this.spriteDict[name]
    }

    getSpriteNameAtIndex(i) {
        return this.sprites[i]
    }

    getSpriteAtIndex(i) {
        const name = this.getSpriteNameAtIndex(i)
        return this.spriteDict[name]
    }

    spriteCount() {
        return this.sprites.length
    }

    // music

    loadMusic(name) {
        const music = r.LoadMusicStream(`./resources/music/${name}`)
        while(!r.IsMusicReady(music)) {
            console.log('loading music stream...')
        }
        return music
    }

    // maps

    loadMap(name) {
        const map = JSON.parse(fs.readFileSync(`./resources/maps/${name}.json`))

        // validation
        for (let layerIndex = 0; layerIndex < map.map.layers; layerIndex++) {
            const layer = map.map[`layer${layerIndex}`];
            if (layer.length !== map.cols * map.rows) {
                throw new Error(`Map validation failed. Layer ${layerIndex} has a length of ${layer.length} but expected ${map.rows * map.cols}.`)
            }
        }

        return map
    }

    saveMap(name, data) {
        fs.writeFileSync(`./resources/maps/${name}.json`, JSON.stringify(data, 2, 2))
    }

    getMap(name) {
        return this.maps[name];
    }
}

const resources = new GameResources();
export default resources;