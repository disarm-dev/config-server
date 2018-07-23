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

test.serial('/instances/:id/published_instance_configs returns 401 when not logged in', async t => {
  const res = await supertest(sails.hooks.http.app)
    .get('/instances/:id/published_instance_configs')

  t.is(res.status, 401)
});

test.serial('/instances/:id/published_instance_configs returns 200 when logged in', async t => {

  const instance = await sails.models.instance.create({name: 'test_instance'}).fetch()

  const instance_config_1 = await sails.models.instanceconfig.create({
    name: 'why_does_it_need_a_name',
    instance_configuration: {applets: {}},
    instance: instance.id
  }).fetch()

  const instance_config_2 = await sails.models.instanceconfig.create({
    name: 'why_does_it_need_a_name_2',
    instance_configuration: { applets: {} },
    instance: instance.id
  }).fetch()

  const res = await supertest(sails.hooks.http.app)
    .get(`/instances/${instance.id}/published_instance_configs`)
    .set('authorization', 'key')
  
  t.is(res.status, 200)
  t.deepEqual(res.body, [instance_config_1, instance_config_2])
});