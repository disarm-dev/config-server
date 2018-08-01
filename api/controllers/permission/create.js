module.exports = {


  friendlyName: 'Adds Permission to user',


  description: 'Assigns a Permission to a user',


  inputs: {
    user_id: {
      type: 'string',
      required: true
    },
    instance_id:{
      type:'string',
      required:false
    },
    value:{
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
    let {api_key} = this.req.headers
    let {user_id} = await Session.findOne({api_key})
    
    const can = await sails.helpers.can.with({user_id,value:'admin',instance_id:inputs.instance_id})

    if(!can){
      return exits.fail('Permission denied')
    }

    const permission = await sails.helpers.addPermission.with(inputs).intercept('fail','fail')
   
    return exits.success(permission)
  }

};
