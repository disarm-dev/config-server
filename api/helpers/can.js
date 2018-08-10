const permissions = {
  'super_admin': {
    'instance': {
      'create': true,
      'read': true,
      'update': true,
      'delete': true
    },
    'instance-config': {
      'create': true,
      'read': true,
      'update': true,
      'delete': true
    },
    'user': {
      'create': true,
      'read': true,
      'update': true,
      'delete': true
    },
    'permission': {
      'create': true,
      'read': true,
      'update': true,
      'delete': true
    }
  },
  'admin': {
    'instance': {
      'read': true
    },
    'instance-config': {
      'create': true,
      'read': true,
      'update': true,
      'delete': true
    },
    'user': {
      'read': true,
    },
    'permission': {
      'create': true,
      'read': true,
      'update': true,
      'delete': true
    }
  },
  'user': {
    'instance': {
      'read': true
    },
    'instance-config': {
      'read': true
    },
    'user': {
      'read': true,
      'update': true
    },
    'permission': {
      'read': true
    }
  }
}

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
      example: -1,
      description: 'Id from the Instance model'
    },
    resource: {
      type: 'string',
      description: 'The reasource the user is trying to access'
    },
    value: {
      type: 'string',
      description: 'What the user is allowed to do'
    },
    action: {
      type: 'string',
      description: 'The type of action',
      example: 'read, write, delete and update'
    },
    req: {
      type: 'ref',
      required: true,
      description: 'Http Request'
    }
  },
  exits: {
    fail: {
      outputExample: 'Could not set permission'
    }
  },

  fn: async function (inputs, exits) {
    let user_id = _.get(inputs, 'user_id', -1)
    let instance_id = _.get(inputs, 'instance_id', -1)
    let value = _.get(inputs, 'value', null)
    let api_key = _.get(inputs, 'headers.api_key', null)
    const resource = _.get(inputs, 'resource', null)
    const action = _.get(inputs, 'action')



    try {
      const session = await Session.findOne({ api_key })
      const loged_in_user_id = _.get(session, 'user_id', null) //Should not be null

      const super_admin_permission = (await Permission.findOne({ user_id:loged_in_user_id, value: 'super-admin' }) !== undefined)
      const self_permission = (await User.findOne({ id: user_id }) === loged_in_user_id) 
      const admin_permission = (await Permission.findOne({ user_id:loged_in_user_id, instance_id, value: 'admin' }) !== undefined)
      const user_instance_permission = (await Permission.findOne({ user_id:loged_in_user_id, instance_id, value: 'user' }) !== undefined)

    

      const can = (super_admin_permission && _.get(permissions, ['super_admin', resource, action])) ||
        (self_permission && _.get(permissions, ['user', resource, action])) ||
        (admin_permission && _.get(permissions, ['admin',resource, action],false))||
        (user_instance_permission && _.get(permissions,['user',resource,action],false))

      //if fetching a user
      return exits.success(can)
    } catch (e) {
      return exits.fail(e)
    }
  }
};

