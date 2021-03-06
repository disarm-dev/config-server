module.exports = {

  friendlyName: 'Logout Actions',


  description: 'Controller for user to log out',


  inputs: {
    id: {
      description: 'The id of the config to look up.',
      type: 'number',
      required: true
    }
  },


  exits: {
    not_authorised_user: {
      responseType: 'unauthorised'
    },
    authorised_user: {
      responseType: 'ok'
    },
  },


  fn: async function (inputs, exits) {
    // TODO: Ensure user has permissions to the instance_configs 
    // TODO: should probably filter where {published: true}
    // TODO: Only return titles or a preview, not entire configs
    //Get needed parameters
    let { api_key } = this.req.headers
    let { user_id } = await Session.findOne({ api_key })
    let instance_id = inputs.id

    //Check permissions
    let can = await sails.helpers.can.with({instance_id, action: 'read',resource:'instance-config', req: this.req })

    if (can) {
      const instanceConfigs = await InstanceConfig.find({ instance: inputs.id })
      return exits.authorised_user(instanceConfigs)
    }

    return exits.not_authorised_user('Permission denied')
    //Action
  }

};
