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
    let instance_id = inputs.id

    //Peform actoion
    const instance = await Instance.create({name: inputs.name}).fetch()
   
    return exits.success(instance)
  }

};
