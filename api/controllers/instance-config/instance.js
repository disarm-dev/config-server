module.exports = {


  friendlyName: 'List Instances for an authenticated user',


  description: 'List out just the titles or slugs for all publicly-visible InstanceConfigs',


  inputs: {

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
    // can user access this action?
    console.log('Instance Controller')
    const all = await InstanceConfig.find() 
    // Filter for public visibility
    const slugs = all.map(i => i.slug)
    // return exits.succ ess(slugs);
    return exits.authorised_user(slugs)
  }

};
