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
    const instance = await Instance.findOne({id: inputs.id})
    return exits.success(instance)
  }

};
