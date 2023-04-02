const app = require('../app')
const request = require('supertest')
const querystring = require('querystring');

const payload ={
  data: {
    name: 'html'
  }
};



const token = "eyJhbGciOiJIUzI1NiJ9.ZmV6ZXV5b2U.9FOe8MoLypU8ECNdYBEqERNR79csqG0_2U01Gq2h8_g"

describe('GET /users', () => {
  test('Test if get users works with initialized table user', async () => {
    const response = await request(app)
      .get('/users')
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Returning users')
    expect(response.body.data.length).toBe(1)
  })
})

//On get les tags

describe('GET /tags', () => {
  test('Test if get tags works with initialized table tags', async () => {
    const response = await request(app)
      .get('/bmt/fezeuyoe/tags')
      .set("x-access-token",token)
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Returning tags')
    expect(response.body.data.length).toBe(0)
  })
})

describe('POST /tags', () => {
  test('Test if post tag works', async () => {
    const response = await request(app)
      .post('/bmt/fezeuyoe/tags')
      .set("x-access-token",token)
      .send('data=' + encodeURIComponent(JSON.stringify(payload.data)))
      console.log(response.body.message)
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Tag Added')
    // expect(response.body.data.length).toBe(0)
  })
})
