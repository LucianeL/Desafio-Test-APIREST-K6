import { describe, expect, chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';
import { Httpx, Post } from 'https://jslib.k6.io/httpx/0.0.6/index.js';
import { sleep, check } from "k6";
import TokenAuth from "../utils/authorization.js"

chai.config.logFailures = true;

//options possui as configurações do teste.
export let options = {
  thresholds: {
    checks: [{ threshold: 'rate == 1.00', abortOnFail: true }],
    http_req_failed: [{ threshold: 'rate == 0.00', abortOnFail: true }],
  },
  vus: 1,
  iterations: 1,
};

let headers = TokenAuth();
let url = new Httpx({ baseURL: 'https://gorest.co.in/public/v2/' });
let response = '';
let payload_createUser = open('./resources/create_user.json');
let id = '';
export let UserId;


function createUser() {

  describe('Criar um usuário com sucesso - 201', () => {

    response = url.post('users/', payload_createUser, { headers });

    describe('Validar usuário criado', () => {
      expect(response.status, 'Response is 201').to.equal(201)
      expect(response).to.have.validJsonBody()
      expect(response.json(), 'validate response keys').to.include.keys('id', 'name', 'email', 'gender', 'status');
      id = JSON.parse(response.body).id;
      console.log("/////////////// " + id)
    })

    sleep(3)

    response = url.get(`users/${id}`, null, { headers });
    console.log(id);
    console.log(response);
    describe('Consultar do usuário criado - ok', () => {
      expect(response.status, 'Response is 200').to.equal(200)
      expect(response).to.have.validJsonBody()
      expect(response.json(), 'validate response keys').to.include.keys('id', 'name', 'email', 'gender', 'status');
    })
  })

}

export default function criarUsuarioSucesso() {
  console.log(response)
  headers.Bearer = response.access_token
  createUser();
  sleep(3)
}
