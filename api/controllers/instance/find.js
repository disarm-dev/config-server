module.exports = {


  friendlyName: 'List Instances for an authenticated user',


  description: 'List out just the titles or slugs for all publicly-visible InstanceConfigs',


  inputs: {

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
    // TODO: only return instances the user has access to 
    const all = await Instance.find().populate('instance_configs', {select: ['version']}) 
    return exits.success(all)
  }

};
