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

test('can create a user, as super admin', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  await sails.helpers.addPermission.with({user_id:user.id, value:'super-admin'})

  const res = await supertest(sails.hooks.http.app)
    .post(`/users`)
    .send({username: 'js', password: 'malaria123'})
    .set('api_key', 'api_key_123')

  t.is(res.status, 200)
})

test.todo('only users with correct permission can create user')

test('invalid username returns error', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  const res = await supertest(sails.hooks.http.app)
    .post(`/users`)
    .send({ username: '', password: 'malaria123' })
    .set('api_key', 'api_key_123')

  t.is(res.status, 400)
})

test('invalid password returns error', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })
  await sails.helpers.addPermission.with({user_id: user.id, value: 'super-admin'})

  const res = await supertest(sails.hooks.http.app)
    .post(`/users`)
    .send({ username: 'js', password: '' })
    .set('api_key', 'api_key_123')
    
  t.is(res.status, 400)
})
