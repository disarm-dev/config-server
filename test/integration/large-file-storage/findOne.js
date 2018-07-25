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

  const upload_res = await supertest(sails.hooks.http.app)
    .post('/largefiles')
    .field('name', 'test_file')
    .field('version', 2)
    .field('instance_id', instance.id)
    .attach('large_file', 'test/fixtures/test.geojson')
    .set('api_key', 'api_key_123')

  t.is(upload_res.status, 200)
  // t.is(upload_res.body.id, true)

  const res = await supertest(sails.hooks.http.app)
    .get(`/largefiles/${upload_res.body.id}`)
    .set('api_key', 'api_key_123')

  // TODO: figure out how to actually test the file is being returned correctly.
  t.is(res.status, 200)
});
