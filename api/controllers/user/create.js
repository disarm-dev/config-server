module.exports = {

  friendlyName: 'Create user',

  description: 'Controller for creating a user',

  inputs: {
    username:{
      type:'string',
      required:true
    },
    password:{
      type:'string',
      required:true
    }
  },

  exits: {
    signup_fail: {
      responseType:'badrequest'
    },
    un_authorised: {
      responseType:'unauthorised'
    },
    success: {
      responseType:'ok'
    },
  },

  fn: async function (inputs, exits) {
    //Get parameters
    const {username, password} = inputs;

    let {api_key} = this.req.headers
    let {user_id} = await Session.findOne({api_key})

    //Check paramenters
    const can = await sails.helpers.can.with({user_id, value:'super-admin'})

    if(!can){
      return exits.un_authorised('Permission denied')
    }
    
    //Action
    const encrypted_password = await sails.helpers.encryptPassword.with({password}).intercept('fail','signup_fail')
    
    await User.create({ username, encrypted_password})
    
    return exits.success()
  }
};