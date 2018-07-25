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

// test runs serially as we don't want data to leak between tests
test.serial('/users/:id/permissions returns 401 when not logged in', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()

  const res = await supertest(sails.hooks.http.app)
    .get(`/users/${user.id}/permissions`)

  t.is(res.status, 401)
});

test.serial('/users/:id/permissions returns users permissions when logged in', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })
  
  const permission = await sails.models.permission.create({ value: 'irs_monitor:write'}).fetch()
  // TOOD: Restore adding permission to a user
  // await sails.models.user.addToCollection(user.id, 'permissions').members([permission.id])
  
  const updatedUser = await sails.models.user.findOne({id: user.id}).populate('permissions')

  const res = await supertest(sails.hooks.http.app)
    .get(`/users/${user.id}/permissions`)
    .set('api_key', 'api_key_123')

  t.is(res.status, 200)
  t.deepEqual(res.body, updatedUser.permissions)
});