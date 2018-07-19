module.exports = {


  friendlyName: 'Public titles',


  description: 'List out just the titles or slugs for all publicly-visible InstanceConfigs',


  inputs: {
    applets: {
      type: 'ref',
      required:false
    },
    aggregations:{
      type:'ref',
      required:false
    },
    decorators:{
      type:'ref',
      required:false
    },
    fake_form:{
      type:'ref',
      required: false
    },
    form:{
      type:'ref',
      required:false
    },
    instance:{
      type:'ref',
      required:true
    },
    map_focus:{
      type:'ref',
      required:false
    },
    presenters:{
      type:'ref',
      required:false
    },
    spatial_hierarchy:{
      type:'ref',
      required:false
    },
    validations:{
      type:'ref',
      required:false
    },
    location_selection:{
      type:'ref',
      required:false
    }
  },


  exits: {
    not_authorised_user: {
      responseType:'unauthorised'
    },
    authorised_user: {
      responseType:'ok'
    },
  },


  fn: async function (inputs, exits) {
    const {
      applets,
      aggregations,
      decorators,
      fake_form,
      form,
      instance,
      map_focus,
      presenters,
      spatial_hierarchy,
      validations,
      location_selection
    } = inputs
    sails.log.info('Create Config',instance)
    return exits.authorised_user(inputs)
  }

};