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

test.serial(`${prefix}/instances returns 401 when not logged in`, async t => {
  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances`)

  t.is(res.status, 401)
});

test.serial(`${prefix}/instances returns instances`, async t => {
  const user = await sails.models.user.create({ username: `nd`, encrypted_password: `123` }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: `api_key_123` })

  const instance_1 = await sails.models.instance.create({ name: `bwa`  }).fetch()
  const instance_2 = await sails.models.instance.create({ name: `nam` }).fetch()

  console.log(user.id,instance_1.id)

  await sails.helpers.addPermission.with({user_id:user.id, instance_id:instance_1.id, value:`user`})
  await sails.helpers.addPermission.with({user_id:user.id, instance_id:instance_2.id, value:`read`})

  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances?user_id=${user.id}`)
    .set(`api_key`, `api_key_123`)
  t.is(res.status, 200)

  t.deepEqual(res.body, [instance_1, instance_2])
});




test.serial(`${prefix}/instances fails for unauthorized user`, async t => {
  const user = await sails.models.user.create({ username: `nd`, encrypted_password: `123` }).fetch()
  const un_authorized_user = await sails.models.user.create({ username: `n`, encrypted_password: `123` }).fetch()
  await sails.models.session.create({ user_id: user.id, api_key: `api_key_123` })
  await sails.models.session.create({ user_id: un_authorized_user.id, api_key: `api_key_1234` })

  const instance_1 = await sails.models.instance.create({ name: `bwa`  }).fetch()
  const instance_2 = await sails.models.instance.create({ name: `nam` }).fetch()

  console.log(user.id,instance_1.id)

  await sails.helpers.addPermission.with({user_id:user.id, instance_id:instance_1.id, value:`user`})
  await sails.helpers.addPermission.with({user_id:user.id, instance_id:instance_2.id, value:`read`})

  const res = await supertest(sails.hooks.http.app)
    .get(`${prefix}/instances?user_id=${user.id}`)
    .set(`api_key`, `api_key_1234`)
  t.is(res.status, 401)
});
