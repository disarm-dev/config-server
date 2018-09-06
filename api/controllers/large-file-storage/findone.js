const SkipperDisk = require('skipper-disk');

module.exports = {

  friendlyName: 'Get large file',

  description: 'Returns the large file that is requested',

  inputs: {
    id: {
      description: 'The id of the config to look up.',
      type: 'number'
    },
    instance:{
      type:'string',
      discription: 'the instance id for the geodata file'
    },
    name:{
      type:'string'
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

    let { api_key} = this.req.headers
    console.log('Params',)
    let can = await sails.helpers.can.with({ req: this.req, resource: 'instance-config', action: 'read' })
    if (!can) {
      return exits.authorised_user('Permission denied')
    }

    const id = this.req.param('id')
    const { instance, name } = inputs
    
    let  file 
    if(id){
      file = await LargeFile.findOne({ id })
    }else if(instance&&name){
      let files = await LargeFile.find({instance, name})
      file = files[0]
    }
    // set the filename to the same file as the user uploaded
    this.res.set("Content-disposition", "attachment; filename='" + file.name + "'");

    return exits.success(file)
  }
};
