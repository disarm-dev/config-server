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

test.serial('/instanceconfig/:id returns 401 when not logged in', async t => {
  const res = await supertest(sails.hooks.http.app)
    .get('/instanceconfig/1')

  t.is(res.status, 401)
});

test.serial('/instanceconfig/:id returns the instance_config', async t => {
  await sails.models.user.create({username: 'nd', api_key: 'api_key_123'})

  const instance = await sails.models.instance.create({ name: 'test_instance' }).fetch()

  const instance_config = await sails.models.instanceconfig.create({
    version: 123,
    instance_configuration: { applets: {} },
    instance: instance.id
  }).fetch()

  instance_config.instance = instance

  const res = await supertest(sails.hooks.http.app)
    .get(`/instanceconfig/${instance_config.id}`)
    .set('api_key', 'api_key_123')

  t.is(res.status, 200)
  t.deepEqual(res.body, instance_config)
});