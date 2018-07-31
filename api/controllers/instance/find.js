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
    let {api_key} = this.req.headers
    let {user_id} = await Session.findOne({api_key})
    let {instances} = await User.findOne({id:user_id}).populate('instances')
    return exits.success(instances)
  }

};
