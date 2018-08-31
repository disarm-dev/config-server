const sails = require('sails');
const rimraf = require('rimraf')
export function setup_sails() {
  return new Promise((resolve, reject) => {
    sails.lift({
      // Your sails app's configuration files will be loaded automatically,
      // but you can also specify any other special overrides here for testing purposes.

      // For example, we might want to skip the Grunt hook,
      // and disable all logs except errors and warnings:
      hooks: { grunt: false },
      log: { level: 'silent' },
    }, async (err) => {
      if (err) {
        reject(err)
      }      
      resolve()
    });
  })
}

export async function clear_db() {
  return new Promise(async (resolve, reject) => {
    await sails.models.user.destroy({})
    await sails.models.permission.destroy({})
    await sails.models.instance.destroy({})
    await sails.models.instanceconfig.destroy({})
    await sails.models.session.destroy({})
    await sails.models.largefile.destroy({})
    // clear the uploaded files
    rimraf('.tmp/uploads', () => {
      resolve()
    })
  })
}

export async function teardown_sails() {
  return new Promise((resolve, reject) => {
    sails.lower((err) => {
      if (err) reject(err)

      resolve()
    })
  })
}
