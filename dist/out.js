System.register("game_resources", ["raylib", "fs"], function (exports_1, context_1) {
    "use strict";
    var raylib_1, fs_1, GameResources, resources;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (raylib_1_1) {
                raylib_1 = raylib_1_1;
            },
            function (fs_1_1) {
                fs_1 = fs_1_1;
            }
        ],
        execute: function () {
            GameResources = (function () {
                function GameResources() {
                }
                GameResources.prototype.load = function () {
                    this.fontRegular = raylib_1.default.LoadFont("./resources/fonts/MinecraftRegular-Bmg3.otf");
                    this.fontBold = raylib_1.default.LoadFont("./resources/fonts/MinecraftBold-nMK1.otf");
                    this.bgMusic = raylib_1.default.LoadMusicStream('./resources/music/bg.wav');
                    while (!raylib_1.default.IsMusicReady(this.bgMusic)) {
                        console.log('loading music stream...');
                    }
                    this.sprites = {};
                };
                GameResources.prototype.loadMap = function (name) {
                    return JSON.parse(fs_1.default.readFileSync("./resources/maps/".concat(name, ".json")));
                };
                GameResources.prototype.saveMap = function (name, data) {
                    fs_1.default.writeFileSync("./resources/maps/".concat(name, ".json"), JSON.stringify(data, 2, 2));
                };
                GameResources.prototype.loadSprite = function (sprite) {
                    var tex = raylib_1.default.LoadTexture("./resources/spritesheets/" + sprite.resource);
                    this.sprites[sprite.name] = tex;
                };
                return GameResources;
            }());
            resources = new GameResources();
            exports_1("default", resources);
        }
    };
});
