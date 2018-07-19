module.exports = {
  
  friendlyName: 'Logout Actions',


  description: 'Controller for user to log out',


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
    let public_instance_config = {}
    return exits.authorised_user(public_instance_config)
  }

};
