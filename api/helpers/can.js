

module.exports = {
  friendlyName: 'Authorized',
  description: 'Authorizes a user to peform an action on a resource',
  inputs: {
    user_id: {
      type: 'number',
      description: 'Id from User model',
      required: true
    },
    instance_id: {
      type: 'number',
      example:-1,
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
    let permission, admin_permission
    try {
      const super_admin_permission = await Permission.findOne({user_id,value:'super-admin'})
      if(Number(instance_id)>-1){
        permission  = await Permission.findOne({user_id, instance_id, value})
        admin_permission = await Permission.findOne({user_id, instance_id, value:'admin'})  
      }
      //if fetching a user
      return exits.success(!!super_admin_permission||!!permission||!!admin_permission)
    } catch(e) {
      return exits.fail(e)
    }
  }
};

