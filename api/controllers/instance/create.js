module.exports = {


  friendlyName: 'Create an instance',


  description: 'Creates an Instance, if it has a config should create a config as well',


  inputs: {
    instance:{
      type: 'json',
      required:true
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
  
    const all = await Instance.create({name:inputs.instance.name}) 
   
    return exits.authorised_user(all)
  }

};
