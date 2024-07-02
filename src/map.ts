
import resources from "./game_resources.js"

export class TileLayer {
    
    spriteName: string;
    walkable: boolean;

    constructor(spriteName) {
        this.setSpriteName(spriteName)
    }

    setSpriteName(spriteName) {
        this.spriteName = spriteName
        this.walkable = spriteName === 'floor'
    }

    canCreate(type) {
        if (type === 'tower') {
            // Towers can only be created on walls
            return this.spriteName === 'wall'; 
        }

        return false;
    }
}

export class Tile {
    
    flatIndex: number;
    layers: any[];

    constructor(flatIndex, numLayers) {
        this.flatIndex = flatIndex
        this.layers = new Array(numLayers)
    }

    setLayer(layerIndex, tileLayer) {
        this.layers[layerIndex] = tileLayer
    }

    getLayer(layerIndex) {
        return this.layers[layerIndex]
    }
}
 
export class Map {

    mapName: string;
    rawMapData: any;
    map: Tile[][];

    constructor(mapName: string, rawMapData: any) {
        this.mapName = mapName;
        this.rawMapData = rawMapData;

        this.map = new Array(this.getNumRows());
        for (let row = 0; row < this.getNumRows(); row++) {
            if (!this.map[row]) {
                this.map[row] = new Array(this.getNumCols());
            }

            for (let col = 0; col < this.getNumCols(); col++) {
                // for 1 dimensional array mapping
                const flatIndex = row * this.getNumCols() + col;

                const tile = new Tile(flatIndex, this.getNumLayers());
                this.setTile(row, col, tile);

                for (let i = 0; i < this.getNumLayers(); i++) {
                    const spriteName = this.rawMapData.map[`layer${i}`][flatIndex] || null;
                    tile.setLayer(i, new TileLayer(spriteName));
                }
            }
        }
    }

    setTile(row: number, col: number, tile: Tile) {
        this.map[row][col] = tile;
    }

    getNumRows(): number {
        return this.rawMapData.rows;
    }

    getNumCols(): number {
        return this.rawMapData.cols;
    }

    getNumLayers(): number {
        return this.rawMapData.map.layers;
    }

    getTile(row: number, col: number): Tile {
        const r = this.map[row];
        return (r) ? r[col] : null;
    }

    getTileLayer(row: number, col: number, layer: number): TileLayer {
        const tile = this.getTile(row, col);
        return (tile) ? tile.getLayer(layer) : null;
    }

    persist() {
        const newMapData = { ...this.rawMapData }
        for (let row = 0; row < this.getNumRows(); row++) {
            for (let col = 0; col < this.getNumCols(); col++) {
                const { flatIndex, layers } = this.getTile(row, col)
                for(let layer = 0; layer < this.getNumLayers(); layer++) {
                    newMapData.map[`layer${layer}`][flatIndex] = layers[layer].spriteName;
                }
            }
        }
        resources.saveMap(this.mapName, newMapData)
    }
}