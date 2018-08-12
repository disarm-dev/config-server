const test = require('ava');
const supertest = require('supertest');
const sails = require('sails')
const { clear_db, setup_sails, teardown_sails } = require('../_helpers')

test.before(async () => {
  await setup_sails()
  await clear_db()
})

test.after(async () => {
  await teardown_sails()
})

test.afterEach.always(async () => {
  await clear_db()
})


test.skip('Permission can be given to a user to access a Config', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const resource = await sails.models.instance.create({ name: 'Botswana' }).fetch()
  let permission = await sails.helpers.addPermission.with({ user_id: user.id, instance_id: resource.id, value: 'read' })
  t.is(permission[0].value, 'read')
})


test.skip('User Can read Authorized instance', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const resource = 'instance'
  const action = 'read'
  const instance = await sails.models.instance.create({ name: 'Botswana' }).fetch()

  await sails.helpers.addPermission.with({ user_id: user.id, instance_id: instance.id, value: 'admin' })

  const fake_req = { headers: { api_key: 'key' } }



  let authorized = await sails.helpers.can.with({ user_id: user.id, instance_id: instance.id, value: 'admin', req: fake_req, resource, action })

  t.true(authorized)
})



test.skip('User Can not perform Unauthorized action on an instance', async t => {
  const resource = 'instance'
  const action = 'write'

  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const instance = await sails.models.instance.create({ name: 'Botswana' }).fetch()

  await sails.helpers.addPermission.with({ user_id: user.id, instance_id: instance.id, value: 'user' })

  const fake_req = { headers: { api_key: 'key' } }

  let authorized = await sails.helpers.can.with({ user_id: user.id, instance_id: instance.id, value: 'user', req: fake_req, resource, action })

  t.true(!authorized)
})


test.skip('User Can not access unauthorized instance', async t => {
  const resource = 'instance'
  const action = 'read'

  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const bwa_instance = await sails.models.instance.create({ name: 'Botswana' }).fetch()
  const nam_instance = await sails.models.instance.create({ name: 'Namibia' }).fetch()

  await sails.helpers.addPermission.with({ user_id: user.id, instance_id: bwa_instance.id, value: 'user' })

  const fake_req = { headers: { api_key: 'key' } }

  let authorized = await sails.helpers.can.with({ user_id: user.id, instance_id: nam_instance.id, value: 'user', req: fake_req, resource, action })
  t.false(authorized)
})

test.skip('Group permission granted', async t => { //Skipping this one since its covered by the admin permiossion above
  const resource = 'instance'
  const action = 'read'

  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const nam_instance = await sails.models.instance.create({ name: 'Namibia' }).fetch()
  await sails.helpers.addPermission.with({ user_id: user.id, value: 'super-admin', instance_id: nam_instance.id })

  const fake_req = { headers: { api_key: 'key' } }

  let authorized = await sails.helpers.can.with({ user_id: user.id, instance_id: nam_instance.id, action: 'write',resource, req: fake_req })

  t.deepEqual(authorized,{})
})

test.todo('super-admin can edit users')

test.todo('super admin can create an instance')

test.todo('Super admin can delete an instance')

test.todo('super admin can edit all instance')

test.todo('super admin can edit instance configs')

test.todo('super admin can edit auxiliary files')

test.todo('super admin can assign super powers')

test.todo('super admin can create admins')

test.todo('super amdin can crud any any instance config')

test.todo('super user can CRUD applet config')

test.todo('super admin can CRUD aux files')

test.todo('admin user can CRUD specific instance users')

test.todo('admin user can edit specific instances')





