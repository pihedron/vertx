// @ts-check

import Vector2 from './Vector2.js'

export default class World {
  /**
   * @type {Record<string, number>}
   */
  indexer = {
    '_': 0,
    '#': 1,
  }

  /**
   * flattened 2d grid of tiles
   * @type {number[]} 
   */
  grid = []

  /** @type {Vector2} */
  dim

  /**
   * creates an immutable world
   * @param {string} map text representation of map
   */
  constructor(map) {
    const rows = map.split('\n')

    this.dim = new Vector2(rows[0].length, rows.length)

    for (let y = 0; y < rows.length; y++) {
      const row = rows[y]
      const cells = row.split('')
      for (let x = 0; x < cells.length; x++) {
        const cell = cells[x]
        this.grid[this.at(x, y)] = this.indexer[cell]
      }
    }
  }

  /**
   * get tile using 2d index
   * @param {number} x
   * @param {number} y
   */
  at(x, y) {
    return y * this.dim.x + x
  }
}