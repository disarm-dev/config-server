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

test('can create a user', async t => {
  await sails.models.user.create({username: 'admin', api_key: 'api_key_123'})

  const res = await supertest(sails.hooks.http.app)
    .post(`/users`)
    .send({username: 'nd', password: 'malaria123'})
    .set('api_key', 'api_key_123')

  t.is(res.status, 200)
})

test.todo('only users with correct permission can create user')

test('invalid username returns error', async t => {
  await sails.models.user.create({ username: 'admin', api_key: 'api_key_123' })

  const res = await supertest(sails.hooks.http.app)
    .post(`/users`)
    .send({ username: '', password: 'malaria123' })
    .set('api_key', 'api_key_123')

  t.is(res.status, 400)
})

test('invalid password returns error', async t => {
  await sails.models.user.create({ username: 'admin', api_key: 'api_key_123' })

  const res = await supertest(sails.hooks.http.app)
    .post(`/users`)
    .send({ username: 'nd', password: '' })
    .set('api_key', 'api_key_123')
    
  t.is(res.status, 400)
})