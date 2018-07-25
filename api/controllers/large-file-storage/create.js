module.exports = {


  friendlyName: 'Create large file',


  description: 'Handles uploads of large files and returns a reference to that object.',


  inputs: {

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
    
    const file = await LargeFile.create({
      name: '',
      version: 1,
      file: '',
      instance: instance_id
    }).fetch()

    return exits.success(file)
  }

};
