// eslint-disable-next-line no-unused-vars
import UserService from './user.service.js';
// eslint-disable-next-line no-unused-vars
const { Response, Request } = 'express';

export default class UserController {
  /**
   *
   * @param {UserService} service
   */
  constructor(service) {
    this.service = service;
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   */
  async create(req, res) {
    try {
      const { name, email, password, phones } = req.body;

      const response = await this.service.create({
        name,
        email,
        password,
        phones,
      });

      return res.status(201).json(response);
    } catch (e) {
      return this.handleError(e, res);
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns
   */
  async findByToken(req, res) {
    try {
      const { id } = req.payload;
      const user = await this.service.findById(id);
      const { name, email, phones, _id } = user;
      return res.status(200).json({
        id: _id,
        name,
        email,
        phones,
      });
    } catch (e) {
      return this.handleError(e, res);
    }
  }

  /**
   *
   * @param {Error} exception
   * @param {Response} res
   * @returns {Response}
   * @private
   */
  handleError(exception, res) {
    return res.status(exception.code).json({ message: exception.message });
  }
}
