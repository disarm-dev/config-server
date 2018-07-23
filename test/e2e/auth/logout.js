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

test.todo('returns error if not logged in')

test('can logout with valid api_key', async t => {
  const username = 'nd'
  const api_key = 'api_key_123'
  await User.create({ username, api_key })
  
  const res = await supertest(sails.hooks.http.app)
    .post(`/auth/logout`)
    .send()
    .set('api_key', api_key)
  
  t.is(res.status, 200)
})

test('cannot logout with invalid api_key', async t => {
  const username = 'nd'
  const api_key = 'api_key_123'
  await User.create({ username, api_key })

  const res = await supertest(sails.hooks.http.app)
    .post(`/auth/logout`)
    .send()
    .set('api_key', 'invalid_api_key')
  
  t.is(res.status, 401)
})