const bcrypt = require('bcrypt')
const cjson = require('cjson')
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
  try {

    const users_json = cjson.load('./fixtures/users.json')
    const permissions = cjson.load('./fixtures/permissions.json')

    const bwa_instance_config = cjson.load('./fixtures/bwa/config.json')
    const nam_instance_config = cjson.load('./fixtures/nam/config.json')
    const bwa_clusters = cjson.load('./fixtures/bwa/clusters.json')
    const bwa_districrts = cjson.load('./fixtures/bwa/districts.json')
    const bwa_villages = cjson.load('./fixtures/bwa/villages.json')
    const nam_constituencies = cjson.load('./fixtures/nam/constituencies.json')
    const nam_villages = cjson.load('./fixtures/nam/villages.json')

    const user_ids = [];

    for (let i = 0; i < users_json.length; i++) {
      user_ids.push(await create_user(users_json[i]))
      console.log('User ids', user_ids)
    }

    await users_json.forEach(async user => {

    });


    const nam_instance = await create_instance(nam_instance_config.instance.title)
    const nam_config = await create_config({ lob: nam_instance_config })
    await Instance.addToCollection(nam_instance.id, 'users', user_ids)
    await Instance.addToCollection(nam_instance.id, 'instanceconfigs', nam_config.id)
    await create_geodata_layer({ name: 'constituencies', file: nam_villages, instance: nam_instance.id })
    await create_geodata_layer({ name: 'villages', file: nam_villages, instance: nam_instance.id })

    user_ids.forEach(async user_id => {
      permissions.forEach(async value => {
        const perm = await sails.helpers.addPermission.with({ user_id, value, instance_id: nam_instance.id })

      })
    })

    const bwa_instance = await create_instance(bwa_instance_config.instance.title)
    const bwa_config = await create_config({ lob: bwa_instance_config })
    await Instance.addToCollection(bwa_instance.id, 'users', user_ids)
    await Instance.addToCollection(bwa_instance.id, 'instanceconfigs', bwa_config.id)
    await create_geodata_layer({ name: 'clusters', file: bwa_clusters, instance: bwa_instance.id })
    await create_geodata_layer({ name: 'villages', file: bwa_villages, instance: bwa_instance.id })
    await create_geodata_layer({ name: 'districts', file: bwa_districrts, instance: bwa_instance.id })

    user_ids.forEach(user_id => {
      permissions.forEach(async value => {
        await sails.helpers.addPermission.with({ user_id, value, instance_id: bwa_instance.id })
      })
    })

    const nw = await Instance.find().populate('users')


    return done()
  }
  catch (e) {
    console.log(e)
    return
  }

};

async function create_user({ password, username, role, permissions }) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, async function (err, hash) {
      let { id } = await User.create({ username, encrypted_password: hash }).fetch();
      await sails.helpers.addPermission.with({ user_id: id, value: role })
      resolve(id)
    });
  })
}

async function create_instance(name) {
  return await Instance.create({ name }).fetch();
}

async function create_config({ lob }) {
  return await InstanceConfig.create({ version: 1, lob }).fetch();
}


async function create_geodata_layer({ name, file, instance }) {
  return await LargeFile.create({ name, version: 1, file, instance }).fetch()
}