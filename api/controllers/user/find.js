module.exports = {

  friendlyName: 'Find users',

  description: 'Returns all users',

  inputs: {

  },

  exits: {
    success: {
      responseType:'ok'
    },
  },


  fn: async function (inputs, exits) {
    const users = await User.find()
    return exits.success(users)
  }
};
