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

test.serial('POST /instances returns 401 when not logged in', async t => {
  const res = await supertest(sails.hooks.http.app)
    .post('/instances')
    .send()

  t.is(res.status, 401)
});

test.serial('POST /instances creates a new instance as super admin', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  const instances_before = await sails.models.instance.find()

  await sails.helpers.addPermission.with({user_id:user.id , value:'super-admin'})

  t.is(instances_before.length, 0)

  const res = await supertest(sails.hooks.http.app)
    .post(`/instances`)
    .send({
      name: 'Botswana'
    })
    .set('api_key', 'api_key_123')

  t.is(res.status, 200)
  
  const instances_after = await sails.models.instance.find()

  t.is(instances_after.length, 1)
});

test.serial('POST /instances fails to create a new instance as admin of another instance', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_1234' })

  const instance = await sails.models.instance.create({'name':'Namibia'}).fetch()

  const instances_before = await sails.models.instance.find()

  await sails.helpers.addPermission.with({user_id:user.id , value:'admin',instance_id:instance.id})

  t.is(instances_before.length, 1)

  const res = await supertest(sails.hooks.http.app)
    .post(`/instances`)
    .send({
      name: 'Botswana'
    })
    .set('api_key', 'api_key_1234')

  t.is(res.status, 401)
  
  const instances_after = await sails.models.instance.find()

  t.is(instances_after.length, 1)
});