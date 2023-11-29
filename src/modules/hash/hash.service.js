export default class HashService {
  constructor(crypt) {
    this.crypt = crypt;
  }

  /**
   * @public
   * @param {string} text
   * @param {number} rounds
   * @returns {Promise<string>}
   */
  hash(text, rounds = 10) {
    return this.crypt.hash(text, rounds);
  }

  /**
   * @public
   * @param {string} text
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  compare(text, hash) {
    return this.crypt.compare(text, hash);
  }
}
