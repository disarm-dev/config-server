const md5 = require('md5');

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

    const api_key = md5(user.username + user.encrypted_password)
    
    const [logged_in_user] = await User.update({ id: user.id }, { api_key }).fetch();
    
    return exits.success(logged_in_user)
  }
};
