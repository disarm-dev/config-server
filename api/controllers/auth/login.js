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
    authorised_user: {
      responseType:'ok'
    },
  },


  fn: async function (inputs, exits) {
    let {username, password} = inputs;
  
    const user = await User.findOne({username})
    console.log(user)
    if(user){
      await sails
      .helpers
      .verifyPassword
      .with({password,encrypted_password:user.password})
      .intercept('fail','login_fail')

      let api_key = md5(user.username+user.password)
      
      let loged_in_user = await User.update(user).set({api_key}).fetch();
      sails.log.silly(loged_in_user)
      return exits.success(loged_in_user)      
    }

    
   return exits.login_fail('User Name Or Password is Incorrect')
  }

};
