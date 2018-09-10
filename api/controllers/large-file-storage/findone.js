const SkipperDisk = require('skipper-disk');

module.exports = {

  friendlyName: 'Get large file',

  description: 'Returns the large file that is requested',

  inputs: {
    id: {
      description: 'The id of the config to look up.',
      type: 'number'
    },
    instance_id:{
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
    not_found:{
      responseType:'notFound'
    }
  },

  fn: async function (inputs, exits) {
    try{
      let { api_key} = this.req.headers
      let can = await sails.helpers.can.with({ req: this.req, resource: 'instance-config', action: 'read' })
      if (!can) {
        return exits.authorised_user('Permission denied')
      }
  
      const id = this.req.param('id')
      const { instance_id, name } = inputs
      
      let  file 
      if(id){
        file = await LargeFile.findOne({ id })
      }else if(instance_id&&name){
        let files = await LargeFile.find({instance:instance_id, name})
        file = files[0]
      }

      if(!file){
        console.log(Object.keys(this.res))
        return exits.not_found()
      }
      // set the filename to the same file as the user uploaded
      this.res.set("Content-disposition", "attachment; filename='" + file.name + "'");
  
  
      return exits.success(file)
    }catch(e){
      return exits.fail(e.toString())
    }
  }
};
