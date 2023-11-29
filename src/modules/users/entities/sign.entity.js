export default class SignEntity {
  /**
   * @type {string}
   */
  id;

  /**
   * The creation timestamp of the user entity.
   * @type {Date}
   */
  createdAt;

  /**
   * The last update timestamp of the user entity.
   * @type {Date}
   */
  updatedAt;

  /**
   * The last login timestamp for the user.
   * @type {Date}
   */
  lastLogin;

  /**
   * The user JWT Token
   * @type {string}
   */
  token;
}
