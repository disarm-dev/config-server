/*
  Group permissions will be hardcoded here until after we have had a discussion
  on an better aproach, like putting it in the database or a separate file
  but it seems static enough to remain here
*/

const group_permissions = {
  'super-admin':[
    'create-user',
    'update-user',
    'read-user',
    'delete-user',
    'create-instance',
    'delete-instance',
    'update-instance',
    'delete-instance',
    'read-instance',
    'edit-instance-config',
    'edit-aux-file',
    'give-admin',
    'give-super-admin',
    'create-aux-file',
    'delete-aux-file',
    'update-aux-files',
    'read-uax-files'
  ],
  'admin':[

  ],
  'general':[],
  'guest':[]
}

module.exports = {
  friendlyName: 'Group level Authorization',
  description: 'Authorizes a group to peform an action',
  inputs: {
    user_id: {
      type: 'string',
      description: 'Id from User model',
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
      outputExample: false
    }
  },

  fn: async function (inputs, exits) {
    let { user_id,value } = inputs;
    try{
      const {tag} = await User.findOne({user_id})
      if(group_permissions[tag].find(value)){
        return exits.success(true)
      }else{
        return exits.success(false)        
      }
    }catch(e){
      exits.fail(e)
    }
  }
};

