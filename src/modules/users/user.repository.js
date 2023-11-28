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
     * @param {CreateUserDTO} user 
     * @returns {Promise<UserEntity>}
     */
	create(user){
		return this.model.create(user);    
	}

	/**
     * 
     * @param {string} email
     * @returns {Promise<UserEntity>}
     */
	findByEmail(email){
		return this.model.findOne({email});
	}
	
	/**
     * 
     * @param {string} id
     * @returns {Promise<UserEntity>}
     */
	findById(id){
		return this.model.findOne({_id: id});
	}

	/**
	 * 
	 * @param {User} user
	 * @returns 
	 */
	save(user){
		return this.model.findOneAndUpdate({_id: user._id}, {$set: {...user}});
	}
}