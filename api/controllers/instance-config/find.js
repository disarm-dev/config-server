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
      responseType:'unauthorised'
    },
    authorised_user: {
      responseType:'ok'
    },
  },


  fn: async function (inputs, exits) {
    // TODO: Ensure user has permissions to the instance_configs 
    // TODO: should probably filter where {published: true}
    // TODO: Only return titles or a preview, not entire configs
    let {api_key} = this.req.headers
    let {user_id} = await Session.find({api_key})
    let instance_id = inputs.id
    if(!sails.helpers.can.with({user_id,user_id,value:'read'})){
      return exits.authorised_user('Permission denied')
    }
    const instanceConfigs = await InstanceConfig.find({instance: inputs.id})
    return exits.authorised_user(instanceConfigs)
  }

};
