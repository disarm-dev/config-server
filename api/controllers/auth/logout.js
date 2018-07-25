
module.exports = {

  friendlyName: 'Logout Action',


  description: 'Controller for user to log out',


  inputs: {
    
  },


  exits: {
    fail: {
      responseType: 'badrequest'
    },
    success: {
      responseType: 'ok'
    },
  },


  fn: async function (inputs, exits) {
    const api_key  = this.req.get('api_key');

    await Session.update({ api_key }, {api_key: ''})
    
    return exits.success()
  }
};
