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
  const resource = await sails.models.instance.create({ name: 'Botswana' }).fetch()
  let permission = await sails.helpers.addPermission.with({ user_id: user.id, instance_id: resource.id, value: 'read' })
  t.is(permission[0].value, 'read')
})


test('User Can read Authorized instance', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const resource = await sails.models.instance.create({ name: 'Botswana' }).fetch()

  await sails.helpers.addPermission.with({ user_id: user.id, instance_id: resource.id, value: 'read' })

  let authorized = await sails.helpers.can.with({ user_id: user.id, instance_id: resource.id, value: 'read' })

  t.true(authorized)
})



test('User Can not perform Unauthorized action on an instance', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const resource = await sails.models.instance.create({ name: 'Botswana' }).fetch()

  await sails.helpers.addPermission.with({ user_id: user.id, instance_id: resource.id, value: 'read' })

  let authorized = await sails.helpers.can.with({ user_id: user.id, instance_id: resource.id, value: 'write' })

  t.true(!authorized)
})


test('User Can access unauthorized instance', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  const bwa_instance = await sails.models.instance.create({ name: 'Botswana' }).fetch()
  const nam_instance = await sails.models.instance.create({ name: 'Namibia' }).fetch()

  await sails.helpers.addPermission.with({ user_id: user.id, instance_id: bwa_instance.id, value: 'read' })

  let authorized = await sails.helpers.can.with({ user_id: user.id, instance_id: nam_instance.id, value: 'write' })

  t.true(!authorized)
})

test('Group permission granted', async t => {
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' ,tag:'super-admin'}).fetch()
  const nam_instance = await sails.models.instance.create({ name: 'Namibia' }).fetch()
  await sails.helpers.addPermission.with({ user_id: user.id, value: 'admin',instance_id: nam_instance.id })

  let authorized = await sails.helpers.can.with({ user_id: user.id, instance_id: nam_instance.id, value: 'write' })

  t.true(authorized)
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





