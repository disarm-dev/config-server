module.exports = {


  friendlyName: 'Create an instance',


  description: 'Creates an Instance, if it has a config should create a config as well',


  inputs: {
    name: {
      type: 'string',
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
    let instance_id = inputs.id

    let can = await sails.helpers.can.with({ req: this.req, resource: 'instance', action: 'create' })
    
    if (can) {
      const instance = await Instance.create({ name: inputs.name }).fetch()
      return exits.success(instance)
    }


    return exits.fail('Permission denied')
  }

};
