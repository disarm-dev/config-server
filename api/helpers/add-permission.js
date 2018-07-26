
module.exports = {
  friendlyName: 'Adds a permission to the database',
  description: '',
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
      await User.addToCollection(user_id, 'instances').members(instance_id)
      const permission = await Permission.update({user_id, instance_id},{value}).fetch()
      return exits.success(permission)
    }catch(e){
      exits.fail(e)
    }
  }
};

