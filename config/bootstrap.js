const bcrypt = require('bcrypt')
/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */


module.exports.bootstrap = async function (done) {

  if (await User.count() > 0) {
    return done();
  }

  bcrypt.hash('Malaria', 10, async function (err, hash) {
    let {id} = await User.create({username: 'groot', encrypted_password: hash}).fetch();
    await sails.helpers.addPermission.with({user_id: id, value: 'super-admin'})
    return done();
  });

};
