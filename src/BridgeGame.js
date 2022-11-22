// @ts-check

const Bridge = require('./Bridge');
const Path = require('./Path');
const Validator = require('./utils/Validator');
const BridgeMaker = require('./BridgeMaker');
const BridgeRandomNumberGenerator = require('./BridgeRandomNumberGenerator');
const { STATUS, BRIDGE, COMMAND, COMMAND_NUMBER } = require('./utils/const');

/**
 * 다리 건너기 게임을 관리하는 클래스
 */
class BridgeGame {
  #bridge;
  #path;
  #count;

  /**
   * @param {string} size
   */
  constructor(size) {
    this.validateBridgeSize(size);
    const generateRandomNumber = BridgeRandomNumberGenerator.generate;
    const bridge = BridgeMaker.makeBridge(Number(size), generateRandomNumber);

    this.#bridge = new Bridge(bridge);
    this.#path = new Path();
    this.#count = 1;
  }

  /**
   * @param {string} bridgeSize
   */
  validateBridgeSize(bridgeSize) {
    Validator.validateNaN(bridgeSize);
    Validator.validateNumberBound(Number(bridgeSize), BRIDGE.MIN, BRIDGE.MAX);
  }

  /**
   * 사용자가 칸을 이동할 때 사용하는 메서드
   * @param {string} moving U 혹은 D
   * @return {{moveStatus: number, pathMap: string[][]}}
   */
  move(moving) {
    const currentPath = this.#path.push(moving);
    const moveStatus = this.#bridge.compare(currentPath);
    const isCorrect = this.#bridge.isCorrect(currentPath);
    const pathMap = this.#path.markOX(isCorrect);

    return { moveStatus, pathMap };
  }

  /**
   * 사용자가 게임을 다시 시도할 때 사용하는 메서드
   * @return {number}
   */
  retry() {
    this.#path = new Path();
    this.#count += 1;
    return COMMAND_NUMBER.RETRY;
  }

  /**
   * @param {string} gameCommand
   */
  convertStringToCommand(gameCommand) {
    Validator.validateEqual(gameCommand, [COMMAND.RETRY, COMMAND.QUIT]);
    return gameCommand === COMMAND.RETRY ? this.retry() : COMMAND_NUMBER.QUIT;
  }

  /**
   * 게임이 종료되었을 때 사용하는 메서드
   * @returns {{count: number, pathMap: string[][], isSuccess: boolean}}
   */
  getResultInfo() {
    const currentPath = this.#path.getPath();

    const count = this.#count;
    const pathMap = this.#path.getPathMap();
    const isSuccess = this.#bridge.compare(currentPath) === STATUS.SUCCESS;

    return { count, pathMap, isSuccess };
  }
}

module.exports = BridgeGame;
