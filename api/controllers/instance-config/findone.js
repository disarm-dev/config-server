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
    //Get needed parameters
    let instance_id = inputs.id

    let can = await sails.helpers.can.with({instance_id, action: 'read',resource:'instance-config', req: this.req})
    if (can) {
      const instance_config = await InstanceConfig.findOne({id: inputs.id})
      return exits.success(instance_config)
    }

    return exits.fail('Permission denied')
  }

};
