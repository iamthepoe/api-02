export default class UserRepository{
	/**
     * @private
     * @type {User}
     */
	model;

	constructor(model){
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
}