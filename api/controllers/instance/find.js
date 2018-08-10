module.exports = {


  friendlyName: 'List Instances for an authenticated user',


  description: 'List out just the titles or slugs for all publicly-visible InstanceConfigs',


  inputs: {
    user_id:{
      type:'string',
      required:true
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

    let can = await sails.helpers.can.with({req:this.req, resource:'instance', action:'read', user_id:inputs.user_id})
    if(can){
      let instances = await Instance.find({user_id})
      return exits.success(instances)
    }
   return exits.fail('Permission denied')
  }

};
