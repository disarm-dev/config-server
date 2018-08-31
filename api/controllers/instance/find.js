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
      let instances = user.instances;
      //Super admin gets all instances

      const is_super_admin = await Permission.findOne({id:inputs.user_id,value:'super-admin'})
      if(is_super_admin){
        const all_instances = await Instance.find()
        instances = all_instances;
      }

      return exits.success(instances)
    }
   return exits.fail('Permission denied')
  }

};
