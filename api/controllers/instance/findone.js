module.exports = {


  friendlyName: 'Get instance',


  description: 'Returns one instance',


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
    //Get needed parameters
    let { api_key } = this.req.headers
    let { user_id } = await Session.findOne({ api_key })
    let instance_id = inputs.id

    //Check for permissons
    let can = await sails.helpers.can.with({ instance_id, action: 'read', req: this.req })

    if (can) {
      const instance = await Instance.findOne({ id: inputs.id })
    return exits.success(instance)
    }
    return exits.fail('Permission denied')
    //Action
    
  }

};
