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


module.exports.bootstrap = async function(done) {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // // Set up fake development data (or if we already have some, avast)
    if (await User.count() > 0) {
      return done();
    }

    bcrypt.hash('Malaria', 10, async function(err, hash) {
     let {id} = await User.create({ username: 'groot', encrypted_password: hash }).fetch();
     console.log('User Id',id)
     await sails.helpers.addPermission.with({user_id: id, value: 'super-admin'})
     return done();
    });

  //

  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)

 //return done()
};
