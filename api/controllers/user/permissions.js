module.exports = {

  friendlyName: 'Permissions Actions',

  description: 'Returns the list of permissions that a user has',

  inputs: {
    id: {
      description: 'The ID of the user to look up.',
      // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
      // if the `userId` parameter is not a number.
      type: 'number',
      // By making the `userId` parameter required, Sails will automatically respond with
      // `res.badRequest` if it's left out.
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
  },

  fn: async function (inputs, exits) {
    const user = await User.findOne({id: inputs.id}).populate('permissions')
    return exits.success(user.permissions)
  }
};
