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
    signup_fail: {
      responseType:'unauthorised'
    },
    success: {
      responseType:'ok'
    },
  },


  fn: async function (inputs, exits) {
    let {username, password} = inputs;
    console.log(sails.helpers)
    password = await sails.helpers.encryptPassword.with({password}).intercept('fail','signup_fail')
    const user = await User.create({username,password})
    return exits.success()
  }
};