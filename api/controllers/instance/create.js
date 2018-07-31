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
      responseType:'unauthorised'
    },
    success: {
      responseType:'ok'
    },
  },


  fn: async function (inputs, exits) { 
    let {api_key} = this.req.headers
    let {user_id} = await Session.findOne({api_key})
    let instance_id = inputs.id
    const can = await sails.helpers.can.with({user_id,value:'val'})
    if(!can){
      return exits.fail('Permission denied')
    }

    const instance = await Instance.create({name: inputs.name}).fetch()
   
    return exits.success(instance)
  }

};
