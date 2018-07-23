const test = require('ava');
const supertest = require('supertest');
const sails = require('sails')
const { setup_sails, teardown_sails, clear_db } = require('../../_helpers')


test.before(async () => {
  await setup_sails()
})

test.after(async () => {
  await teardown_sails()
})

test.afterEach.always(async () => {
  await clear_db()
})

test.serial('/instances returns 401 when not logged in', async t => {
  const res = await supertest(sails.hooks.http.app)
    .get('/instances')

  t.is(res.status, 401)
});

test.serial('/instances returns instances', async t => {
  await sails.models.user.create({username: 'nd', api_key: 'api_key_123'})

  const instance_1 = await sails.models.instance.create({ name: 'bwa'  }).fetch()
  const instance_2 = await sails.models.instance.create({ name: 'nam' }).fetch()

  instance_1.instance_configs = []
  instance_2.instance_configs = []

  const res = await supertest(sails.hooks.http.app)
    .get('/instances')
    .set('api_key', 'api_key_123')

  t.is(res.status, 200)
  t.deepEqual(res.body, [instance_1, instance_2])
});


test.serial('/instances returns instances and their instance_configs', async t => {
  await sails.models.user.create({ username: 'nd', api_key: 'api_key_123' })

  const instance_1 = await sails.models.instance.create({ name: 'bwa' }).fetch()
  const instance_2 = await sails.models.instance.create({ name: 'nam' }).fetch()

  const instance_config = await sails.models.instanceconfig.create({ instance: instance_1.id, version: 1, instance_configuration: {}}).fetch()
  

  instance_1.instance_configs = [{
    id: instance_config.id,
    instance: instance_1.id,
    version: 1, 
  }]

  instance_2.instance_configs = []


  const res = await supertest(sails.hooks.http.app)
    .get('/instances')
    .set('api_key', 'api_key_123')

  t.is(res.status, 200)
  t.deepEqual(res.body, [instance_1, instance_2])
});
