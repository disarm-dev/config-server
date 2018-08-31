
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
      let permission
      if(value==='super-admin'){
        pemrission = await Permission.create({user_id,value}).fetch()
      }else if(!instance_id){
        return exits.fail('No instance id')
      }
      else{
        await User.addToCollection(user_id, 'instances').members(instance_id)
        permission = await Permission.update({user_id, instance_id},{value}).fetch()
      }
      return exits.success(permission)
    } catch(e) {
      return exits.fail(e)
    }
  }
};

