const test = require('ava');
const supertest = require('supertest');
const sails = require('sails')
const { setup_sails, teardown_sails } = require('../../_helpers')


// We can definitely do this in a smarter way. 
// Ideally we fire up the server once and then just clear data between each test
test.beforeEach(async () => {
  await setup_sails()
})

test.afterEach.always(async () => {
  await teardown_sails()
})

// test runs serially as we don't want data to leak between tests
test.serial('/users/:id/permissions', async t => {
  const res = await supertest(sails.hooks.http.app)
    .get('/users/1/permissions')

  t.is(res.status, 200)
});