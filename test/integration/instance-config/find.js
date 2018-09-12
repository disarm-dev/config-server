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

test.serial(`/instances/:id/published_instanceconfigs returns 401 when not logged in`, async t => {
  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances/:id/published_instanceconfigs`)

  t.is(res.status, 401)
});

test.serial(`/instances/:id/published_instanceconfigs returns 200 when logged in band authorised as injstance admin`, async t => {
  const user = await sails.models.user.create({ username: `nd`, encrypted_password: `123` }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: `api_key_123` })

  const instance = await sails.models.instance.create({name: `test_instance`}).fetch()
  await sails.helpers.addPermission.with({user_id: user.id, instance_id: instance.id, value:`admin`})
  
  const instance_config_1 = await sails.models.instanceconfig.create({
    version: 1,
    name: `why_does_it_need_a_name`,
    lob: {applets: {}},
    instance: instance.id
  }).fetch()

  const instance_config_2 = await sails.models.instanceconfig.create({
    version: 1,
    name: `why_does_it_need_a_name_2`,
    lob: { applets: {} },
    instance: instance.id
  }).fetch()

  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances/${instance.id}/published_instanceconfigs?user_id=${user.id}`)
    .set(`api_key`, `api_key_123`)

    delete instance_config_1.lob
    delete instance_config_2.lob
    t.is(res.status, 200)
    t.deepEqual(res.body, [instance_config_1, instance_config_2])

});


test.serial(`/instances/:id/published_instanceconfigs returns 200 when logged in and authorised as super admin`, async t => {
  const user = await sails.models.user.create({ username: `nd`, encrypted_password: `123` }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: `api_key_123` })

  const instance = await sails.models.instance.create({name: `test_instance`}).fetch()
  await sails.helpers.addPermission.with({user_id: user.id,  value:`super-admin`})

  const instance_config_1 = await sails.models.instanceconfig.create({
    version: 1,
    name: `why_does_it_need_a_name`,
    lob: {applets: {}},
    instance: instance.id
  }).fetch()

  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances/${instance.id}/published_instanceconfigs?user_id=${user.id}`)
    .set(`api_key`, `api_key_123`)
  t.is(res.status, 200)

});



test.serial(`/instances/:id/published_instanceconfigs fails with 401 when user is an admin of another instance`, async t => {
  const user = await sails.models.user.create({ username: `nd`, encrypted_password: `123` }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: `api_key_123` })

  const instance = await sails.models.instance.create({name: `test_instance`}).fetch()
  const instance2 = await sails.models.instance.create({name: `test_instance`}).fetch()
  await sails.helpers.addPermission.with({user_id: user.id, instance_id: instance2.id, value:`admin`})

  const instance_config_1 = await sails.models.instanceconfig.create({
    version: 1,
    name: `why_does_it_need_a_name`,
    lob: {applets: {}},
    instance: instance.id
  }).fetch()

  const instance_config_2 = await sails.models.instanceconfig.create({
    version: 1,
    name: `why_does_it_need_a_name_2`,
    lob: { applets: {} },
    instance: instance.id
  }).fetch()

  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances/${instance.id}/published_instanceconfigs?user_id=${user.id}`)
    .set(`api_key`, `api_key_123`)
  t.is(res.status, 401)

});
