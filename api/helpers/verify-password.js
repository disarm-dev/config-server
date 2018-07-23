
const bcrypt = require('bcrypt')
module.exports = {


  friendlyName: 'Check for permissions',


  description: '',

  inputs: {
    password: {
      type: 'string',
      description: 'Text Password',
      required: true
    },
    encrypted_password:{
      type: 'string',
      description: 'Encrypted Password',
      required: true
    }
  },

  exits: {
    success: {
      outputExample: 'Correct Password'
    },
    fail:{
      outputExample: 'Incorrect Password'
    }
  },


  fn: async function (inputs, exits) {
    bcrypt.compare(inputs.password, inputs.encrypted_password, function(err, valid) {
      sails.log.silly(err,valid,inputs)
      if(err || !valid){
        return exits.fail('Invalid username and password combination!')
      }
      exits.success()
  });
  }
};

