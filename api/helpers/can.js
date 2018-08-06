

module.exports = {
  friendlyName: 'Authorized',
  description: 'Authorizes a user to peform an action on a resource',
  inputs: {
    user_id: {
      type: 'string',
      description: 'Id from User model',
      required: true
    },
    instance_id: {
      type: 'string',
      description: 'Id from the Instance model'
    },
    value:{
      type:'string',
      description: 'What the user is allowed to do'
    }
  },
  exits: {
    fail:{
      outputExample: 'Could not set permission'
    }
  },

  fn: async function (inputs, exits) {
    let { user_id, instance_id, value } = inputs;
    instance_id = instance_id||-1;
    try {
      let  permission
      let admin_permission 
      //const super_admin_permission = await Permission.findOne({user_id,value:'super-admin'})
        permission  = await Permission.findOne({user_id, instance_id, value})
        admin_permission = await Permission.findOne({user_id, instance_id:Number(instance_id)||-1, value:'admin'})  
      //if fetching a user
      return exits.success(!!permission||!!admin_permission)
    } catch(e) {
      return exits.fail(e)
    }
  }
};

