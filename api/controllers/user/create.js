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
    success: {
      responseType:'ok'
    },
  },

  fn: async function (inputs, exits) {
    const {username, password} = inputs;
    
    const encrypted_password = await sails.helpers.encryptPassword.with({password}).intercept('fail','signup_fail')
    
    await User.create({ username, encrypted_password})
    
    return exits.success()
  }
};