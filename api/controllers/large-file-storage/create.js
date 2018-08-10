module.exports = {


  friendlyName: 'Create large file',


  description: 'Handles uploads of large files and returns a reference to that object.',


  inputs: {
    // name of the file is 'large_file'

    name: {
      type: 'string',
      required: true
    },
    version: {
      type: 'number',
      required: true
    },
    instance_id: {
      type: 'string',
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

    let { api_key } = this.req.headers
    let { user_id } = await Session.findOne({ api_key })
    let instance_id = inputs.id
    if (!sails.helpers.can.with({ user_id, user_id, value: 'read', req: this.req })) {
      return exits.authorised_user('Permission denied')
    }


    this.req.file('large_file').upload({}, async (err, files) => {
      if (err) {
        return exits.fail(err)
      }

      if (files.length === 0) {
        return exits.fail('No files uploaded')
      }

      const file = await LargeFile.create({
        file: files[0],
        name: inputs.name,
        version: inputs.version,
        instance: inputs.instance_id
      }).fetch()

      return exits.success(file)
    })
  }
};
