import validator from 'validator';
import BadRequestException from '../../server/exceptions/bad-request.exception.js';
import NotFoundException from '../../server/exceptions/not-found.exception.js';

const {isEmail, isEmpty} = validator;

export default class UserService {
	/** @private */
	validations = {
		name: this.validateName,
		email: this.validateEmail,
		password: this.validatePassword,
		phones: this.validatePhones,
	};

	/**
	 * 
	 * @param {import('../../models/User.js').default} repository 
	 * @param {import('../hash/hash.service.js').default} hashService 
	 * @param {import('../auth/auth.service.js').default} authService 
	 */
	constructor(repository, hashService, authService){
		this.repository = repository;
		this.hashService = hashService;
		this.authService = authService;
	}

	/**
     * 
     * @param {import('./dto/create-user.dto.js').default} user
	 * @returns {Promise<{
	 * 	id: string;
	 * 	createdAt: Date;
	 * 	updatedAt: Date;
	 * 	lastLogin: Date;
	 * 	token: string;
	 * }>}
     */
	async create(user){
		const errors = this.validateUser(user);
		if(errors.trim())
			throw new BadRequestException(errors);

		const userWithCurrentEmail = await this.repository.findByEmail(user.email);

		if(userWithCurrentEmail)
			throw new BadRequestException('Email is already in use');


		const createdUser = await this.repository.create({
			...user,
			password: await this.hashService.hash(user.password)
		});

		const { _id, createdAt, updatedAt, lastLogin } = createdUser;

		return {
			id: _id,
			createdAt,
			updatedAt,
			lastLogin,
			token: await this.authService.createToken(createdUser),
		};
	}

	/**
	 * 
	 * @param {string} id 
	 * @returns {import('./entities/user.entity.js').default}
	 */
	async findById(id){
		const user = await this.repository.findById(id);
		if(!user) throw new NotFoundException('User not found.');
		return user;
	}

	/**
	 * 
	 * @param {string} email 
	 * @returns {import('./entities/user.entity.js').default}
	 */
	async findByEmail(email){
		const user = await this.repository.findByEmail(email);
		if(!user) throw new NotFoundException('User not found.');
		return user;
	}

	/**
	 * 
	 * @param {import('./entities/user.entity.js').default} user 
	 * @returns 
	 */
	async save(user){
		return this.repository.save(user);
	}

	/**
     * @private
     * @param {import('./dto/create-user.dto.js').default} user
	 * @returns {string}
     */
	validateUser(user){
		let errors = '';
		Object.keys(user).forEach(key=>{
			const validate = this.validations[key];
			const property = user[key];
			const message = validate(property);
			errors+= message ? ` ${message}\n` : '';
		});

		return errors;
	}

	/**
	 * @private
	 * @param {string} name
	 * @returns {string}
	 */
	validateName(name){
		this.isEmpty('name', name);
	}

	/**
	 * @private
	 * @param {string} email
	 * @returns {string}
	 */
	validateEmail(email){
		this.isEmpty('email', email);
		if(!isEmail(email))
			return '"email" needs to be valid.';
	}

	/**
	 * @private
	 * @param {string} password
	 * @returns {string}
	 */
	validatePassword(password){
		if(!(typeof password === 'string'))
			return '"password" needs to be a string';

		if(password.length < 8)
			return '"password" length needs to be greater than 7';
	}

	/**
	 * @private
	 * @param {{ddd: string, number: string}[]} phones
	 * @returns {string}
	 */
	validatePhones(phones){
		phones.forEach(phone=>{
			if(!(phone['ddd'] || phone['number']))
				return '"phone" needs to have a ddd and number';
            
			if(phone['ddd'] != undefined && isNaN(phone['ddd']))
				return '"ddd" needs to be a number';

			if(phone['number'] != undefined && isNaN(phone['number']))
				return '"number" needs to be a number';
		});
	}

	/**
	 * 
	 * @param {string} key 
	 * @param {any} value 
	 * @returns {string}
	 */
	isEmpty(key, value){
		if(isEmpty(value))
			return `"${key}" cannot be empty.`;
	}
}