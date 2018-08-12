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

test.serial('/instances returns 401 when not logged in', async t => {
  const res = await supertest(sails.hooks.http.app)
    .get('/instances')

  t.is(res.status, 401)
});

test.serial('/instances returns instances', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  const instance_1 = await sails.models.instance.create({ name: 'bwa'  }).fetch()
  const instance_2 = await sails.models.instance.create({ name: 'nam' }).fetch()

  console.log(user.id,instance_1.id)

  await sails.helpers.addPermission.with({user_id:user.id, instance_id:instance_1.id, value:'user'})
  await sails.helpers.addPermission.with({user_id:user.id, instance_id:instance_2.id, value:'read'})

  const res = await supertest(sails.hooks.http.app)
    .get(`/instances?user_id=${user.id}`)
    .set('api_key', 'api_key_123')
  t.is(res.status, 200)

  t.deepEqual(res.body, [instance_1, instance_2])
});
