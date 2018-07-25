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

test.serial('/instances/:id/published_instanceconfigs returns 401 when not logged in', async t => {
  const res = await supertest(sails.hooks.http.app)
    .get('/instances/:id/published_instanceconfigs')

  t.is(res.status, 401)
});

test.serial('/instances/:id/published_instanceconfigs returns 200 when logged in', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  const instance = await sails.models.instance.create({name: 'test_instance'}).fetch()

  const instance_config_1 = await sails.models.instanceconfig.create({
    version: 1,
    name: 'why_does_it_need_a_name',
    lob: {applets: {}},
    instance: instance.id
  }).fetch()

  const instance_config_2 = await sails.models.instanceconfig.create({
    version: 1,
    name: 'why_does_it_need_a_name_2',
    lob: { applets: {} },
    instance: instance.id
  }).fetch()

  const res = await supertest(sails.hooks.http.app)
    .get(`/instances/${instance.id}/published_instanceconfigs`)
    .set('api_key', 'api_key_123')
  
  t.is(res.status, 200)
  t.deepEqual(res.body, [instance_config_1, instance_config_2])
});