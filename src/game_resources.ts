import * as r from 'raylib'
import * as fs from 'fs'
import * as path from 'path'

class GameResources {
    
    sprites: any[];
    spriteDict: any;
    fonts: { regular: r.Font, bold: r.Font };
    music: { bg: r.Music };
    maps: { dungeon: any; };

    load() {
        console.log('loading resources...')
        let start = new Date();

        this.sprites = []
        this.spriteDict = {}

        const spritesJson = fs.readFileSync(`./resources/spritesheets/sprites.json`)
        this.spriteDict = JSON.parse(spritesJson.toString())
        for (let key in this.spriteDict) {
            const spriteConfig = this.spriteDict[key];
            this.spriteDict[key].texture = this.loadSpriteTexture(spriteConfig.resource)
            this.sprites.push(key)
        }

        this.fonts = {
            regular: r.LoadFont("./resources/fonts/MinecraftRegular-Bmg3.otf"),
            bold: r.LoadFont("./resources/fonts/MinecraftBold-nMK1.otf"),
        }

        this.music = {
            bg: this.loadMusic('bg.wav'),
        }

        this.maps = {
            dungeon: this.loadMap('dungeon')
        }

        const diffMs = new Date().getTime() - start.getTime()
        console.log('finished loading resources, took ' + diffMs + 'ms');
    }

    // sprites

    loadSpriteTexture(spritePath): r.Texture2D {
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

    spriteCount(): number {
        return this.sprites.length
    }

    // music

    loadMusic(name): r.Music {
        const music = r.LoadMusicStream(`./resources/music/${name}`)
        while(!r.IsMusicReady(music)) {
            console.log('loading music stream...')
        }
        return music
    }

    // maps

    loadMap(name) {
        return JSON.parse(fs.readFileSync(`./resources/maps/${name}.json`).toString())
    }

    saveMap(name, data) {
        fs.writeFileSync(`./resources/maps/${name}.json`, JSON.stringify(data))
    }

    getMap(name) {
        return this.maps[name];
    }
}

const resources = new GameResources();
export default resources;