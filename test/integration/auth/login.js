const test = require(`ava`);
const supertest = require(`supertest`);
const sails = require(`sails`)
const { clear_db, setup_sails, teardown_sails } = require(`../../_helpers`)
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

test(`can login with correct user and password`, async t => {
  const username = `nd`
  const password = `malaria123`
  const encrypted_password = await sails.helpers.encryptPassword.with({ password })
  await User.create({ username, encrypted_password })

  const res = await supertest(sails.hooks.http.app)
    .post(`${prefix}/auth/login`)
    .send({
      username,
      password
    })

  t.is(res.status, 200)
  t.is(res.body.username, `nd`)
  t.true(res.body.api_key.length > 0)
})

test(`returns 401 for incorrect username or password`, async t => {
  const username = `nd`
  const password = `malaria123`
  const encrypted_password = await sails.helpers.encryptPassword.with({ password })
  await User.create({ username, encrypted_password })

  const res = await supertest(sails.hooks.http.app)
    .post(`${prefix}/auth/login`)
    .send({
      username,
      password: `incorrect_password`
    })

  t.is(res.status, 401)
})


test('Login twice and use each session', async t => {
  const username = 'nd'
  const password = 'malaria123'
  const encrypted_password = await sails.helpers.encryptPassword.with({ password })
  const user = await User.create({ username, encrypted_password }).fetch()

  const first_login = await supertest(sails.hooks.http.app)
    .post(`${prefix}/auth/login`)
    .send({
      username,
      password
    })

  t.is(first_login.status,200)

  const second_login = await supertest(sails.hooks.http.app)
    .post(`${prefix}/auth/login`)
    .send({
      username,
      password
    })


  t.is(second_login.status,200)

  //Then make requests using each of the api_keys from the logins

  const first_request = await supertest(sails.hooks.http.app)
  .get(`${prefix}/users/${user.id}/permissions`)
  .set('api_key', first_login.body.api_key)


  const second_request = await supertest(sails.hooks.http.app)
  .get(`${prefix}/users/${user.id}/permissions`)
  .set('api_key', second_login.body.api_key)

  t.is(first_request.status, 200)
  t.is(second_request.status, 200)
  t.is(first_login.body.api_key,second_login.body.api_key)
})