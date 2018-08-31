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

    
    let can = await sails.helpers.can.with({ req: this.req, resource: 'instance-config', action: 'create' })

    if (!can) {
      return exits.fail('Permission denied')
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

