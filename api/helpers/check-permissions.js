const jwt = require('jsonwebtoken');

module.exports = {

  friendlyName: 'Check permissions',


  description: 'Look up a user\'s "rights" within a particular organization.',


  inputs: {
    userId: { type: 'number', required: true },
    orgId: { type: 'number', required: true }
  },

  exits: {
    success: {
      outputFriendlyName: 'Rights',
      outputDescription: `A user's "rights" within an org.`,
      outputType: ['string']
    },
    orgNotFound: {
      description: 'No such organization exists.'
    }
  },

  fn: async function(inputs, exits) {
    var org = await Organization.findOne(inputs.orgId)
    .populate('adminUsers', { id: inputs.userId })
    .populate('regularUsers', { id: inputs.userId });

    

    if (!org) { throw 'orgNotFound'; }

    var rights = [];
    if (org.regularUsers.length !== 0) {
      rights = ['basicAccess', 'inviteRegularUsers'];
    } else if (org.adminUsers.length !== 0) {
      rights = ['basicAccess', 'inviteRegularUsers', 'removeRegularUsers', 'inviteOrgAdmins'];
    } else if (org.owner === inputs.userId) {
      rights = ['basicAccess', 'inviteRegularUsers', 'removeRegularUsers', 'inviteOrgAdmins', 'removeOrDemoteOrgAdmins'];
    }
    // ^^This could be as simple or as granular as you need, e.g.
    // ['basicAccess', 'inviteRegularUsers', 'inviteOrgAdmins', 'removeRegularUsers', 'removeOrDemoteOrgAdmins']

    return exits.success(rights);
  }

};