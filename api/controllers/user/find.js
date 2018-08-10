module.exports = {

  friendlyName: 'Find users',

  description: 'Returns all users',

  inputs: {},

  exits: {
    success: {
      responseType: 'ok'
    },
    un_authorised: {
      responseType: 'unauthorised'
    }
  },


  fn: async function (inputs, exits) {
    //Parameters
    const {username, password} = inputs;

    const can = await sails.helpers.can.with({resource: 'user', action: 'read', req: this.req})

    if (can) {
      let {api_key} = this.req.headers
      let {user_id} = await Session.findOne({api_key})
      const users = await User.find()
      return exits.success(users)
    }
    exits.un_authorised('Permission Denied')
  }
};
