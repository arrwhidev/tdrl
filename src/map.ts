import resources from "./game_resources.js"

const LAYER_MAP      = 0
const LAYER_ELEMENTS = 1

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
        } else if (type === 'guy') {
            // Guys can only be created on floor
            return this.spriteName === 'floor';
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

    rawData: any;
    data: Tile[][];

    constructor(rawData: any) {
        this.rawData = rawData;

        // Convert raw map data into an internal 2 dimensional array.

        this.data = new Array(this.getNumRows());
        for (let row = 0; row < this.getNumRows(); row++) {
            if (!this.data[row]) {
                this.data[row] = new Array(this.getNumCols());
            }

            for (let col = 0; col < this.getNumCols(); col++) {
                // For 1 dimensional array mapping
                const flatIndex = row * this.getNumCols() + col;

                const tile = new Tile(flatIndex, this.getNumLayers());
                this.setTile(row, col, tile);

                for (let i = 0; i < this.getNumLayers(); i++) {
                    const spriteName = this.rawData.map[`layer${i}`][flatIndex] || null;
                    tile.setLayer(i, new TileLayer(spriteName));
                }
            }
        }
    }

    setTile(row: number, col: number, tile: Tile) {
        this.data[row][col] = tile;
    }

    getNumRows(): number {
        return this.rawData.rows;
    }

    getNumCols(): number {
        return this.rawData.cols;
    }

    getNumLayers(): number {
        return this.rawData.map.layers;
    }

    getTile(row: number, col: number): Tile {
        const r = this.data[row];
        return (r) ? r[col] : null;
    }

    getTileLayer(row: number, col: number, layer: number): TileLayer {
        const tile = this.getTile(row, col);
        return (tile) ? tile.getLayer(layer) : null;
    }

    persist(): void {
        const newMapData = { ...this.rawData }
        for (let row = 0; row < this.getNumRows(); row++) {
            for (let col = 0; col < this.getNumCols(); col++) {
                const { flatIndex, layers } = this.getTile(row, col)
                for(let layer = 0; layer < this.getNumLayers(); layer++) {
                    newMapData.map[`layer${layer}`][flatIndex]
                        = layers[layer].spriteName;
                }
            }
        }
        resources.saveMap(this.rawData.name, newMapData)
    }
}