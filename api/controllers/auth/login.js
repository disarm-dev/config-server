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
    const user = await User.find(inputs)
    if(user.length){
      this.req.session.user = user[0];
      return exits.authorised_user(user[0])      
    }
   return exits.login_fail('User Name Or Password is Incorrect')
  }

};
