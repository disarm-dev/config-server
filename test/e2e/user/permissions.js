const test = require('ava');
const supertest = require('supertest');
const sails = require('sails')
const { setup_sails, teardown_sails } = require('../../_helpers')


// We can definitely do this in a smarter way. 
// Ideally we fire up the server once and then just clear data between each test
test.before(async () => {
  await setup_sails()
})

test.after(async () => {
  await teardown_sails()
})

// TODO: Need test.afterEach hook where we clear data in DB

// test runs serially as we don't want data to leak between tests
test.serial('/users/:id/permissions returns 401 when not logged in', async t => {
  const permission = await sails.models.permission.create({ value: 'irs_monitor:write' }).fetch()

  const user = await sails.models.user.create({
    username: 'nd',
    password: 'm'
  }).fetch()

  await sails.models.user.addToCollection(user.id, 'permissions').members([permission.id])

  const res = await supertest(sails.hooks.http.app)
    .get(`/users/${user.id}/permissions`)

  t.is(res.status, 401)
});

test.serial('/users/:id/permissions returns users permissions when logged in', async t => {
  const permission = await sails.models.permission.create({ value: 'irs_monitor:write'}).fetch()

  const user = await sails.models.user.create({ 
    username: 'nd', 
    password: 'm'
  }).fetch()

  await sails.models.user.addToCollection(user.id, 'permissions').members([permission.id])
  
  const updatedUser = await sails.models.user.findOne({id: user.id}).populate('permissions')

  const res = await supertest(sails.hooks.http.app)
    .get(`/users/${user.id}/permissions`)
    // TODO: set the actual key for the user
    .set('authorization', 'key')

  t.is(res.status, 200)
  t.deepEqual(res.body, updatedUser.permissions)
});