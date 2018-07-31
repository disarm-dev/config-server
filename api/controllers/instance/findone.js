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
    let {api_key} = this.req.headers
    let {user_id} = await Session.findOne({api_key})
    let instance_id = inputs.id

    let can = await sails.helpers.can.with({user_id,instance_id,value:'read'})
    
    if(!can){
      return exits.fail('Permission denied')
    }
    const instance = await Instance.findOne({id: inputs.id})
    return exits.success(instance)
  }

};
