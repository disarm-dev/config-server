module.exports = {


  friendlyName: 'Adds Permission to user',


  description: 'Assigns a Permission to a user',


  inputs: {
    user_id: {
      type: 'string',
      required: true
    },
    instance_id: {
      type: 'string',
      required: false
    },
    value: {
      type: 'string',
      required: true
    }
  },


  exits: {
    fail: {
      responseType: 'unauthorised'
    },
    success: {
      responseType: 'ok'
    },
  },


  fn: async function (inputs, exits) {
    const can = await sails.helpers.can.with({ user_id: inputs.user_id, action: 'update', resource:'permission', instance_id: inputs.instance_id, req: this.req })

    if (can) {
      const permission = await sails.helpers.addPermission.with(inputs).intercept('fail', 'fail')
      return exits.success(permission)
    }

    return exits.fail('Permission denied')
  }

};
