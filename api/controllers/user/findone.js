module.exports = {


  friendlyName: 'Get instance-config',


  description: 'Get a single instance-config',


  inputs: {
    id: {
      description: 'The id of the config to look up.',
      type: 'number',
      required: true
    }
  },


  exits: {
    fail: {
      responseType: 'unauthorised'
    },
    success: {
      responseType: 'ok'
    },
  },


  fn: async function (inputs, exits) {

    let {api_key} = this.req.headers
    let {user_id} = await Session.findOne({api_key})

    let {id} = inputs

    const can = await sails.helpers.can.with({user_id: id, resource: 'user', action: 'read', req: this.req})
    if (can) {
      const user = await User.findOne({id})
      return exits.success(user)
    }

    return exits.fail('Permission denied')
  }

};
