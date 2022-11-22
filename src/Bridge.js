const { STATUS } = require('./utils/const');

class Bridge {
  #bridge;

  /**
   * @param {string[]} bridge
   */
  constructor(bridge) {
    this.#bridge = bridge;
  }

  /**
   * @param {string[]} path
   * @returns
   */
  isCorrect(path) {
    const bridge = this.getBridge();
    const current = path.length - 1;

    return path[current] === bridge[current];
  }

  /**
   * @param {string[]} path
   * @returns
   */
  isLast(path) {
    const bridge = this.getBridge();
    return path.length === bridge.length;
  }

  /**
   * @param {string[]} path
   * @returns {0 | 1 | 2}
   */
  compare(path) {
    const isLast = this.isLast(path);
    const isCorrect = this.isCorrect(path);

    if (!isCorrect) return STATUS.FAILURE;
    if (isLast) return STATUS.SUCCESS;
    return STATUS.CONTINUE;
  }

  getBridge() {
    return this.#bridge;
  }
}

module.exports = Bridge;
