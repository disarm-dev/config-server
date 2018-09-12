/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const prefix = `/v1`;


module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn`t match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  [`POST ${prefix}/auth/login`]: `auth.login`,
  [`POST ${prefix}/auth/logout`]: `auth.logout`,

  [`POST ${prefix}/users`]: `user.create`,
  [`GET ${prefix}/users`]: `user.find`,
  [`GET ${prefix}/users/:id/permissions`]: `user.permissions`,
  
  [`GET ${prefix}/instances`]: `instance.find`,
  [`GET ${prefix}/instances/:id`]: `instance.findone`,
  [`GET ${prefix}/instances/:id/published_instanceconfigs`]: `instance.populate`,
  [`POST ${prefix}/instances`]: `instance.create`,
  
  [`GET ${prefix}/instanceconfigs/:id`]: `instance-config.findone`,

  [`POST ${prefix}/largefiles`]: `large-file-storage.create`,
  [`GET ${prefix}/largefiles/:id`]: `large-file-storage.findone`,
  [`GET ${prefix}/largefiles`]: `large-file-storage.findone`,
  
  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
