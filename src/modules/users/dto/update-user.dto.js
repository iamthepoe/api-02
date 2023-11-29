/**
 * Data Transfer Object (DTO) for updating an user.
 * @class
 */
export default class UpdateUserDTO {
  /**
   * The name of the user.
   * @type {string | undefined}
   */
  name;

  /**
   * The email address of the user.
   * @type {string | undefined}
   */
  email;

  /**
   * The password associated with the user.
   * @type {string | undefined}
   */
  password;

  /**
   * An array of phone entities associated with the user.
   * @type {Array<import('../entities/phone.entity.js').default> | undefined}
   */
  phones;
}
