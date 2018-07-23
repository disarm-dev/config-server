const md5 = require('md5');

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

    const user = await User.findOne({ api_key })

    await User.update({ id: user.id }, { api_key: '' })

    return exits.success()
  }
};
