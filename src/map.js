export class TileLayer {
    constructor(spriteName) {
        this.spriteName = spriteName
    }
}

export class Tile {
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
    constructor(rawMapData) {
        this.rawMapData = rawMapData;

        console.log(
            this.getNumRows(),
            this.getNumCols(),
            this.getNumLayers(),
        )

        this.map = new Array(this.getNumRows());
        for (let row = 0; row < this.getNumRows(); row++) {
            if (!this.map[row]) {
                this.map[row] = new Array(this.getNumCols());
            }

            for (let col = 0; col < this.getNumCols(); col++) {
                // for 1 dimensional array mapping
                const flatIndex = row * this.getNumCols() + col;
                this.map[row][col] = new Tile(flatIndex, this.getNumLayers())

                for (let i = 0; i < this.getNumLayers(); i++) {
                    const spriteName = this.rawMapData.map[`layer${i}`][flatIndex];
                    const tile = this.getTile(row, col);
                    tile.setLayer(i, new TileLayer(spriteName));
                }
            }
        }
    }

    getNumRows() {
        return this.rawMapData.rows
    }

    getNumCols() {
        return this.rawMapData.cols
    }

    getNumLayers() {
        return this.rawMapData.map.layers
    }

    getTile(row, col) {
        return this.map[row][col];
    }

    getTileLayer(row, col, layer) {
        return this.getTile(row, col).getLayer(layer);
    }
}