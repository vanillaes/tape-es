import { Package } from '@vanillaes/esmtk'

/** @typedef {import('@vanillaes/esmtk').RawPackage} RawPackage */

/**
 * @typedef {object} RawTapeConfig
 * @property {object|undefined} [tape] Tape config
 * @property {string|string[]} [tape.files] Test files config option
 * @property {string|string[]} [tape.ignore] Test ignore config option
 */

/**
 * @typedef {RawPackage & RawTapeConfig} RawTapePackage
 */

/**
 * package.json - Tape Config
 * @augments Package
 */
export class TapeConfig extends Package {
  /** @type {RawTapeConfig} */
  #config = {}

  /**
   * @param {string} [cwd] Current working directory
   */
  constructor (cwd) {
    super(cwd)

    /** @type {RawTapePackage} */
    const contents = this.contents
    this.#config = contents.tape || {}

    // fix the prototype
    Object.setPrototypeOf(this, new.target.prototype)
  }

  /**
   * Lint Config
   * @type {RawTapeConfig}
   */
  get config () {
    return this.#config
  }

  /**
   * Lint files config option
   * @type {string[]|undefined}
   */
  get files () {
    if (Array.isArray(this.#config.files)) {
      /** @type {string[]} */ return this.#config.files
    }
    if (typeof this.#config.files === 'string') {
      return [this.#config.files]
    }
    return undefined
  }

  /**
   * Test ignore config option
   * @type {string[]|undefined}
   */
  get ignore () {
    if (Array.isArray(this.#config.ignore)) {
      /** @type {string[]} */ return this.#config.ignore
    }
    if (typeof this.#config.ignore === 'string') {
      return [this.#config.ignore]
    }
    return undefined
  }
}
