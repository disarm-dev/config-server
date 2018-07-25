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

test.serial('/largefiles/:id returns 401 when not logged in', async t => {
  const res = await supertest(sails.hooks.http.app)
    .get('/largefiles/1')

  t.is(res.status, 401)
});


test.serial('GET /largefiles/:id returns a file', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  const instance = await sails.models.instance.create({ name: 'test_instance' }).fetch()
  const file = await sails.models.largefile.create({name: 'name', version: 1, instance: instance.id, file: {is_file: true}}).fetch()

  const res = await supertest(sails.hooks.http.app)
    .get(`/largefiles/${file.id}`)
    .set('api_key', 'api_key_123')

  t.deepEqual(res.body, file)
  t.is(res.status, 200)
});
