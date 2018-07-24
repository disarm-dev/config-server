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
    .post(`/auth/logout`)
    .send()
    
  t.is(res.status, 401)
})

test('can logout with valid api_key', async t => {
  const username = 'nd'
  const encrypted_password = '123'
  const user = await User.create({ username, encrypted_password }).fetch()

  const api_key = 'api_key_123'
  await Session.create({user_id: user.id, api_key})
  
  const res = await supertest(sails.hooks.http.app)
    .post(`/auth/logout`)
    .send()
    .set('api_key', api_key)
  
  t.is(res.status, 200)
})

test('logging out clears session ', async t => {
  const username = 'nd'
  const encrypted_password = '123'
  const user = await User.create({ username, encrypted_password }).fetch()

  const api_key = 'api_key_123'
  await Session.create({ user_id: user.id, api_key })

  const res = await supertest(sails.hooks.http.app)
    .post(`/auth/logout`)
    .send()
    .set('api_key', api_key)

  t.is(res.status, 200)

  const session = await Session.findOne({user_id: user.id})

  t.is(session.api_key, '')
})

test('cannot logout with invalid api_key', async t => {
  const username = 'nd'
  const api_key = 'api_key_123'
  const encrypted_password = '123'
  await User.create({ username, encrypted_password, api_key })

  const res = await supertest(sails.hooks.http.app)
    .post(`/auth/logout`)
    .send()
    .set('api_key', 'invalid_api_key')
  
  t.is(res.status, 401)
})