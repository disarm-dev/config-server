

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
    try {
      const super_admin_permission = await Permission.findOne({user_id,value:'super-admin'})
      const permission = await Permission.findOne({user_id, instance_id, value})
      const admin_permission = await Permission.findOne({user_id, instance_id, value:'admin'})
      return exits.success(!!super_admin_permission||!!permission||!!admin_permission)
    } catch(e) {
      return exits.fail(e)
    }
  }
};

