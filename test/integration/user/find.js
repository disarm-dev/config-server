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
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  await sails.models.user.create({ username: 'js', encrypted_password: '123' })
  await sails.models.user.create({ username: 'sm', encrypted_password: '123' })

  await sails.helpers.addPermission.with({user_id:user.id, value:'super-admin'})

  const res = await supertest(sails.hooks.http.app)
    .get(`/users`)
    .set('api_key', 'api_key_123')

    t.is(res.status,200)

  t.is(res.body.length, 3)
})