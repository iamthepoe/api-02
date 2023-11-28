import validator from 'validator';
import BadRequestException from '../../server/exceptions/bad-request.exception.js';
import NotFoundException from '../../server/exceptions/not-found.exception.js';

const {isEmail, isEmpty} = validator;

export default class UserService {
	/**
     * @type {UserRepository}
     * @private
     */
	repository;

	/** @private */
	validations = {
		name: (name)=>{
			this.validations.isEmpty('name', name);
			if(!(typeof name === 'string'))
				return '"name" needs to be a string.';
		},
		email: (email)=>{
			this.validations.isEmpty('email', email);
			if(!isEmail(email))
				return '"email" needs to be valid.';
		},
		password: (password)=>{
			this.validations.isEmpty('password', password);
			if(!(typeof password === 'string'))
				return '"password" needs to be a string';

			if(password.length < 8)
				return '"password" length needs to be greater than 7';
		},
		phones: (phones)=>{
			if(!(phones['ddd'] || phones['number']))
				return '"phone" needs to have a ddd and number';
            
			if(phones['ddd'] != undefined && isNaN(phones['ddd']))
				return '"ddd" needs to be a number';

			if(phones['number'] != undefined && isNaN(phones['number']))
				return '"number" needs to be a number';
		},
		isEmpty: (key, value)=>{
			if(isEmpty(value))
				return `"${key}" cannot be empty.`;
		}
	};

	constructor(repository, hashService){
		this.repository = repository;
		this.hashService = hashService;
	}

	/**
     * 
     * @param {CreateUserDTO} user
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

		const {_id, createdAt, updatedAt, lastLogin} = createdUser;

		return {
			id: _id,
			createdAt,
			updatedAt,
			lastLogin,
			token: null
		};
	}

	async findById(id){
		const user = await this.repository.findById(id);
		if(!user) throw new NotFoundException('User not found.');
		return user;
	}

	async findByEmail(email){
		const user = await this.repository.findByEmail(email);
		if(!user) throw new NotFoundException('User not found.');
		return user;
	}

	/**
     * 
     * @param {CreateUserDTO} user
	 * @private
	 * @returns {string}
     */
	validateUser(user){
		let errors = '';
		Object.keys(user).forEach(key=>{
			const validate = this.validations[key];
			const property = user[key];
			if(key === 'phones'){
				user[key].forEach(phone=>{
					const message = this.validations.phones(phone);
					errors+= message ? ` ${message}\n` : '';
				});
			}else{
				const message = validate(property);
				errors+= message ? ` ${message}\n` : '';
			}
		});

		return errors;
	}
}