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

test.serial('/largefiles returns 401 when not logged in', async t => {
  const res = await supertest(sails.hooks.http.app)
    .post('/largefiles')

  t.is(res.status, 401)
});


test.serial('POST /largefiles returns 400 when name is missing', async t => {
  const instance = await sails.models.instance.create({ name: 'test_instance' }).fetch()
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  await sails.helpers.addPermission.with({user_id: user.id,  value:'super-admin'})

  const res = await supertest(sails.hooks.http.app)
    .post('/largefiles')
    .field('version', 2)
    .field('instance_id', instance.id)
    .attach('large_file', 'test/fixtures/test.geojson')
    .set('api_key', 'api_key_123')

  t.is(res.status, 400)
});

test.serial('POST /largefiles returns 400 when version is missing', async t => {
  const instance = await sails.models.instance.create({ name: 'test_instance' }).fetch()
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  await sails.helpers.addPermission.with({user_id: user.id,  value:'super-admin'})

  const res = await supertest(sails.hooks.http.app)
    .post('/largefiles')
    .field('name', 'name')
    .field('instance_id', instance.id)
    .attach('large_file', 'test/fixtures/test.geojson')
    .set('api_key', 'api_key_123')

  t.is(res.status, 400)
});

test.serial('POST /largefiles returns 400 when instance_id is missing', async t => {
  const instance = await sails.models.instance.create({ name: 'test_instance' }).fetch()
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  await sails.helpers.addPermission.with({user_id: user.id,  value:'super-admin'})

  const res = await supertest(sails.hooks.http.app)
    .post('/largefiles')
    .field('name', 'name')
    .field('version', 2)
    .attach('large_file', 'test/fixtures/test.geojson')
    .set('api_key', 'api_key_123')

  t.is(res.status, 400)
});

test.serial('POST /largefiles creates and returns a file reference', async t => {
  const instance = await sails.models.instance.create({ name: 'test_instance' }).fetch()
  const user = await sails.models.user.create({ username: 'nd', encrypted_password: '123' }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: 'api_key_123' })

  await sails.helpers.addPermission.with({user_id: user.id,  value:'super-admin'})

  const res = await supertest(sails.hooks.http.app)
    .post('/largefiles')
    .field('name', 'test_file')
    .field('version', 2)
    .field('instance_id', instance.id)
    .attach('large_file', 'test/fixtures/test.geojson')
    .set('api_key', 'api_key_123')

  t.is(res.status, 200)
  t.truthy(res.body.file)
});