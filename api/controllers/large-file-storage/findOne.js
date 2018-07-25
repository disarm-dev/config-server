module.exports = {

  friendlyName: 'Get large file',

  description: 'Returns the large file that is requested',

  inputs: {
    id: {
      description: 'The id of the config to look up.',
      type: 'number',
      required: true
    }
  },

  exits: {
    fail: {
      responseType: 'badrequest'
    },
    success: {
      responseType: 'ok'
    },
  },

  fn: async function (inputs, exits) {
    const file = await LargeFile.findOne({ id: inputs.id })
    return exits.success(file)
  }
};
