module.exports = {


  friendlyName: 'Get instance-config',


  description: 'Get a single instance-config',


  inputs: {
    id: {
      description: 'The id of the config to look up.',
      type: 'number',
      required: true
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
    //Get needed parameters
    let {api_key} = this.req.headers
    let {user_id} = await Session.findOne({api_key})

    let {id} = inputs
    const super_admin_permission = await Permission.findOne({user_id,value:'super-admin'})

    //Checking pemrissions
    const can = (user_id === id)||super_admin_permission;
    if(!can){
      return exits.fail('Permission denied')
    }

    //Action
    const user = await User.findOne({id})
    return exits.success(user)
  }

};
