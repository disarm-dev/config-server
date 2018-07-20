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

test.serial('/instances/:id/published_instance_configs', async t => {
  const res = await supertest(sails.hooks.http.app)
    .get('/instances/:id/published_instance_configs')

  t.is(res.status, 200)
});