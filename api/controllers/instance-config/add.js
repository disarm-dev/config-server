module.exports = {


  friendlyName: 'Public titles',


  description: 'List out just the titles or slugs for all publicly-visible InstanceConfigs',


  inputs: {
    version: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    lob: {
      type: 'ref'
    },
    instance: {
      type: 'number'
    }
  },


  exits: {
    not_authorised_user: {
      responseType: 'unauthorised'
    },
    authorised_user: {
      responseType: 'ok'
    },
  },


  fn: async function (inputs, exits) {
    //Get needed 
    const {
      version,
      name,
      lob,
      instance
    } = inputs
    let { api_key } = this.req.headers
    let { user_id } = await Session.find({ api_key })
    let instance_id = inputs.id

    if (!sails.helpers.can.with({ user_id, user_id, value: 'read', req: this.req })) {
      return exits.authorised_user('Permission denied')
    }

    //Action
    return exits.authorised_user(inputs)
  }

};