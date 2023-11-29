export default class UserRepository{
	/**
	 * 
	 * @param {import('../../models/User.js').default} model 
	 */
	constructor(model){
		/**@private */
		this.model = model;
	}

	/**
     * 
     * @param {import('./dto/create-user.dto.js').default} user 
     * @returns {Promise<{
	 * 	_id: string;
	 * 	email: string;
	 * 	password: string;
	 * 	phones: {ddd: string, number: string}[];
	 * 	createdAt: Date;
	 * 	updatedAt: Date;
	 * 	lastLogin: Date;
	 * }>}
     */
	create(user){
		return this.model.create(user);    
	}

	/**
     * 
     * @param {string} email
     * @returns {Promise<{
	 * 	_id: string;
	 * 	email: string;
	 * 	password: string;
	 * 	phones: {ddd: string, number: string}[];
	 * 	createdAt: Date;
	 * 	updatedAt: Date;
	 * 	lastLogin: Date;
	 * }>}
     */
	findByEmail(email){
		return this.model.findOne({email});
	}
	
	/**
     * 
     * @param {string} id
     * @returns {Promise<{
	 * 	_id: string;
	 * 	email: string;
	 * 	password: string;
	 * 	phones: {ddd: string, number: string}[];
	 * 	createdAt: Date;
	 * 	updatedAt: Date;
	 * 	lastLogin: Date;
	 * }>}
	*/
	findById(id){
		return this.model.findOne({_id: id});
	}

	/**
	 * 
	 * @param {import('./entities/user.entity.js')} user
	 */
	save(user){
		return this.model.findOneAndUpdate({_id: user._id}, {$set: {...user}});
	}
}