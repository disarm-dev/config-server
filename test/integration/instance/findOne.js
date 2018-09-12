const test = require(`ava`);
const supertest = require(`supertest`);
const sails = require(`sails`)
const { setup_sails, teardown_sails, clear_db } = require(`../../_helpers`)
const prefix = `/v1`;


test.before(async () => {
  await setup_sails()
})

test.after(async () => {
  await teardown_sails()
})

test.afterEach.always(async () => {
  await clear_db()
})

test.serial(`${prefix}/instances/:id returns 401 when not logged in`, async t => {
  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances/1`)

  t.is(res.status, 401)
});

test.serial(`${prefix}/instances/:id returns 200 when logged in and authorized`, async t => {
  const user = await sails.models.user.create({ username: `nd`, encrypted_password: `123` }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: `api_key_123` })

  const instance = await sails.models.instance.create({ name: `test_instance` }).fetch()
  await sails.helpers.addPermission.with({user_id: user.id, instance_id: instance.id, value:`user`})

  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances/${instance.id}`)
    .set(`api_key`, `api_key_123`)

  t.is(res.status, 200)
  t.deepEqual(res.body, instance)
});



test.serial(`${prefix}/instances/:id returns 200 if user is super admin`, async t => {
  const user = await sails.models.user.create({ username: `nd`, encrypted_password: `123` }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: `api_key_123` })

  const instance = await sails.models.instance.create({ name: `test_instance` }).fetch()
  await sails.helpers.addPermission.with({user_id: user.id, value:`super-admin`})

  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances/${instance.id}`)
    .set(`api_key`, `api_key_123`)

  t.is(res.status, 200)
  t.deepEqual(res.body, instance)
});



test.serial(`/instances/:id returns 401 when user is admin of diferent instance from requested instance`, async t => {
  const user = await sails.models.user.create({ username: `nd`, encrypted_password: `123` }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: `api_key_123` })

  const instance = await sails.models.instance.create({ name: `test_instance` }).fetch()
  const instance_2 = await sails.models.instance.create({ name: `test_instance2` }).fetch()
  await sails.helpers.addPermission.with({user_id: user.id, instance_id: instance.id, value:`admin`})

  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances/${instance_2.id}`)
    .set(`api_key`, `api_key_123`)

  t.is(res.status, 401)
});


test.serial(`/instances/:id returns 401 when user is  of different instance from requested instance`, async t => {
  const user = await sails.models.user.create({ username: `nd`, encrypted_password: `123` }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: `api_key_123` })

  const instance = await sails.models.instance.create({ name: `test_instance` }).fetch()
  const instance_2 = await sails.models.instance.create({ name: `test_instance2` }).fetch()
  await sails.helpers.addPermission.with({user_id: user.id, instance_id: instance.id, value:`user`})

  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances/${instance_2.id}`)
    .set(`api_key`, `api_key_123`)

  t.is(res.status, 401)
});





