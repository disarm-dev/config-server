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

test.serial('/instances/:id returns 401 when not logged in', async t => {
  const res = await supertest(sails.hooks.http.app)
    .get('/instances/1')

  t.is(res.status, 401)
});

test.serial('/instances/:id returns 200 when logged in', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  const instance = await sails.models.instance.create({ name: 'test_instance' }).fetch()

  instance.instanceconfigs = []
  instance.users = []

  const res = await supertest(sails.hooks.http.app)
    .get(`/instances/${instance.id}`)
    .set('api_key', 'api_key_123')

  t.is(res.status, 200)
  t.deepEqual(res.body, instance)
});