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

test('can login with correct user and password', async t => {
  const username = 'nd'
  const password = 'malaria123'
  const encrypted_password = await sails.helpers.encryptPassword.with({ password })
  await User.create({ username, encrypted_password })

  const res = await supertest(sails.hooks.http.app)
    .post(`/auth/login`)
    .send({
      username,
      password
    })
  t.is(res.status, 200)
  t.is(res.body.username, 'nd')
})

test('returns 401 for incorrect username or password', async t => {
  const username = 'nd'
  const password = 'malaria123'
  const encrypted_password = await sails.helpers.encryptPassword.with({ password })
  await User.create({ username, encrypted_password })

  const res = await supertest(sails.hooks.http.app)
    .post(`/auth/login`)
    .send({
      username,
      password: 'incorrect_password'
    })

  t.is(res.status, 401) 
})