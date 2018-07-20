
const bcrypt = require('bcrypt')
module.exports = {


  friendlyName: 'Check for permissions',


  description: '',

  inputs: {
    password: {
      type: 'string',
      description: 'Text Password',
      required: true
    }
  },

  exits: {
    fail:{
      outputExample: 'Incorrect Password'
    }
  },


  fn: async function (inputs, exits) {
    bcrypt.hash(inputs.password, 10, function(err, hash) {
      if (err) return exits.fail('An error occured');
      sails.log.silly(inputs,hash)
      return exits.success(hash)
  });
  }
};

