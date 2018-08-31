module.exports = {


  friendlyName: 'Get instance-config',


  description: 'Get a single instance-config',


  inputs: {
    parentid:{
      type:'number'
    },
    association:{
      type:'string'
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

    let {parentid} = inputs
    const can = await sails.helpers.can.with({resource: 'user', action: 'read', req: this.req, user_id:parentid})

    if(!can){
      return exits.fail('Permission denied')
    }

    const user = await User.findOne({id:parentid}).populate('permissions')
    return exits.success(user.permissions)
  }

};
