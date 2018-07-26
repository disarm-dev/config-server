const test = require('ava');
const supertest = require('supertest');
const sails = require('sails')
const { clear_db, setup_sails, teardown_sails } = require('../_helpers')

test.before(async () => {
  await setup_sails()
})

test.after(async () => {
  await teardown_sails()
})

test.afterEach.always(async () => {
  await clear_db()
})


test('Permission can be given to a user to access a Config', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const resource = await sails.models.instance.create({  name: 'Botswana' }).fetch()
  let permission = await sails.helpers.addPermission.with({user_id:user.id, instance_id:resource.id, value:'read'})
  t.is(permission[0].value,'read')
})


test('User Can read Authorized instance', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const resource = await sails.models.instance.create({  name: 'Botswana' }).fetch()

  await sails.helpers.addPermission.with({user_id:user.id, instance_id:resource.id, value:'read'})
  
  let authorized = await sails.helpers.can.with({user_id:user.id, instance_id:resource.id, value:'read'})
  
  t.true(authorized)
})



test('User Can not perform Unauthorized action on aninstance', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const resource = await sails.models.instance.create({  name: 'Botswana' }).fetch()

  await sails.helpers.addPermission.with({user_id:user.id, instance_id:resource.id, value:'read'})
  
  let authorized = await sails.helpers.can.with({user_id:user.id, instance_id:resource.id, value:'write'})
  
  t.true(!authorized)
})



