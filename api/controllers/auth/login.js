module.exports = {

  friendlyName: 'Login Action',


  description: 'Controller for user to log in',


  inputs: {

  },


  exits: {
    not_authorised_user: {
      responseType:'unauthorised'
    },
    authorised_user: {
      responseType:'ok'
    },
  },


  fn: async function (inputs, exits) {
    
    return exits.authorised_user(token)
  }

};
