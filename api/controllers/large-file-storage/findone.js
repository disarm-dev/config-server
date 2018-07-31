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

    let {api_key} = this.req.headers
    let {user_id} = await Session.find({api_key})
    let instance_id = inputs.id
    if(!sails.helpers.can.with({user_id,user_id,value:'read'})){
      return exits.authorised_user('Permission denied')
    }

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
