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

    let can = await sails.helpers.can.with({req:this.req, resource:'user', action:'read', user_id:inputs.user_id})

    if(can){
      let user = await User.findOne({id:inputs.user_id}).populate('instances')
      console.log('Instances', user)
      return exits.success(user.instances)
    }
   return exits.fail('Permission denied')
  }

};
