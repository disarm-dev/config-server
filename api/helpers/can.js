

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
      description: 'Id from the Instance model',
      required: true
    },
    value:{
      type:'string',
      description: 'What the user is allowed to do',
      required: true
    }
  },
  exits: {
    fail:{
      outputExample: 'Could not set permission'
    }
  },

  fn: async function (inputs, exits) {
    let { user_id, instance_id, value } = inputs;
    try{
      const permission = await Permission.findOne({user_id, instance_id, value})
      return exits.success(permission?true:false)
    }catch(e){
      exits.fail(e)
    }
  }
};

