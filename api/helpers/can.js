module.exports = {


  friendlyName: 'Check for permissions',


  description: '',

  inputs: {

    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true
    }
  },

  exits: {

  },


  fn: async function (inputs, exits) {
    // All done.
    return true
  }
};

