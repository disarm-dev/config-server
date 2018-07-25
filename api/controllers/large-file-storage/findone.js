const SkipperDisk = require('skipper-disk');

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
    const id = this.req.param('id')
    const file = await LargeFile.findOne({id})
    
    
    var fileAdapter = SkipperDisk(/* optional opts */);

    // set the filename to the same file as the user uploaded
    this.res.set("Content-disposition", "attachment; filename='" + file.name + "'");

    // Stream the file down
    return fileAdapter.read(file.file.fd)
      .on('error', function (err) {
        return exits.fail(err);
      })
      .pipe(this.res);
  }
};