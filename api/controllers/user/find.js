module.exports = {


  friendlyName: 'Permissions Actions',


  description: 'Returns the list of permissions that a user has',


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
    let permissions = [];
    return exits.authorised_user('permissions')
  }

};
