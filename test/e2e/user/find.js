const test = require('ava');
const supertest = require('supertest');
const sails = require('sails')
const { clear_db, setup_sails, teardown_sails } = require('../../_helpers')

test.before(async () => {
  await setup_sails()
})

test.after(async () => {
  await teardown_sails()
})

test.afterEach.always(async () => {
  await clear_db()
})

test('returns error if not logged in', async t => {
  const res = await supertest(sails.hooks.http.app)
    .get(`/users`)

  t.is(res.status, 401)
})

test('can get all users', async t => {
  await sails.models.user.create({ username: 'nd', password: 'm', api_key: 'api_key_123' })

  await sails.models.user.create({ username: 'js', password: 'm' })
  await sails.models.user.create({ username: 'sm', password: 'm' })

  const res = await supertest(sails.hooks.http.app)
    .get(`/users`)
    .set('api_key', 'api_key_123')

  t.is(res.body.length, 3)
})