module.exports = {


  friendlyName: 'Get instance-config',


  description: 'Get a single instance-config',


  inputs: {
    id: {
      description: 'The id of the config to look up.',
      type: 'number',
      required: true
    },
    version: {
      description: 'The version of the instance-config to look up.',
      type: 'number',
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
    // can user access this action?
    console.log('Instance Controller')
    const all = await InstanceConfig.find() 
    // Filter for public visibility
    const slugs = all.map(i => i.slug)
    // return exits.succ ess(slugs);

    
    return exits.success(slugs)
  }

};
