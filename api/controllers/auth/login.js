const uuid = require('uuid/v4')

module.exports = {

  friendlyName: 'Login Action',


  description: 'Controller for user to log in',


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
    login_fail: {
      responseType:'unauthorised'
    },
    success: {
      responseType:'ok'
    },
  },


  fn: async function (inputs, exits) {
    const {username, password} = inputs;
  
    const user = await User.findOne({username})

    if (!user) {
      return exits.login_fail('Invalid username or password')
    }
    
    await sails
      .helpers
      .verifyPassword
      .with({ password, encrypted_password: user.encrypted_password})
      .intercept('fail', 'login_fail')

    const api_key = uuid()
    
    const found_session = await Session.findOne({user_id: user.id})
    
    if (found_session) {
      await Session.update({ id: found_session.id }, {api_key})
    } else {
      await Session.create({ user_id: user.id, api_key })
    }

    user.api_key = api_key

    delete user.encrypted_password

    return exits.success(user)
  }
};
