const test = require('ava');
const supertest = require('supertest');
const sails = require('sails')
const { setup_sails, teardown_sails, clear_db } = require('../../_helpers')


test.before(async () => {
  await setup_sails()
})

test.after(async () => {
  await teardown_sails()
})

test.afterEach.always(async () => {
  await clear_db()
})

// test.serial('/instances/:id/published_instance_configs returns 401 when not logged in', async t => {
//   const res = await supertest(sails.hooks.http.app)
//     .get('/instances/:id/published_instance_configs')

//   t.is(res.status, 401)
// });

// test.serial('/instances/:id/published_instance_configs returns 200 when logged in', async t => {

//   await sails.models.user.create({ username: 'nd', api_key: 'api_key_123' })


//   const res = await supertest(sails.hooks.http.app)
//     .get(`/instances/${instance.id}/published_instance_configs`)
//     .set('api_key', 'api_key_123')

//   t.is(res.status, 200)
//   t.deepEqual(res.body, [instance_config_1, instance_config_2])
// });