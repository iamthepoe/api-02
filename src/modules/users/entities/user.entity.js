export default class UserEntity {
  /** @type {string} */
  _id;

  /**
   * The name of the user.
   * @type {string}
   */
  name;

  /**
   * The email address of the user.
   * @type {string}
   */
  email;

  /**
   * The password associated with the user.
   * @type {string}
   */
  password;

  /**
   * The last login timestamp for the user.
   * @type {Date}
   */
  lastLogin;

  /**
   * An array of phone entities associated with the user.
   * @type {Array<PhoneEntity>}
   */
  phones;

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
}
