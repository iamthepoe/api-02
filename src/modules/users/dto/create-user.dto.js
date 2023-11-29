/**
 * Data Transfer Object (DTO) for creating an user.
 * @class
 */
export default class CreateUserDTO {
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
   * An array of phone entities associated with the user.
   * @type {Array<import('../entities/phone.entity.js').default>}
   */
  phones;
}
