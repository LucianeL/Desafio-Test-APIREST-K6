import { describe, expect, chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.6/index.js';
import { sleep } from "k6";
import TokenAuth from "../utils/authorization.js"

chai.config.logFailures = true;


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
let payload_createUser_put_failed = open('./resources/create_user_put_failed.json');
let payload_updateUser_failed = open('./resources/update_user_failed.json');
let id = '';


function CriarParaFalha() {

  describe('Criar um usuário com sucesso - 201', () => {

    response = url.post('users/', payload_createUser_put_failed, { headers });
    console.log("Post " + id);
    console.log(response);
    describe('Validar usuário criado', () => {
      expect(response.status, 'Response is 201').to.equal(201)
      expect(response).to.have.validJsonBody()
      expect(response.json(), 'validate response keys').to.include.keys('id', 'name', 'email', 'gender', 'status');
      id = JSON.parse(response.body).id;

    })
    sleep(5)
  })

}

function ValidarUsuarioCriado() {

  describe('Consultar um usuário com ID - Sucesso - 200', () => {

    response = url.get(`users/${id}`, null, { headers });
    console.log("Get " + id);
    //console.log(response);
    describe('Consultar usuário criado - ok', () => {
      expect(response.status, 'Response is 200').to.equal(200)
      expect(response).to.have.validJsonBody()
      //expect(response.json(), 'validate response keys').to.include.keys('id', 'name', 'email', 'gender', 'status');

    })
  })
}

function AlterarComFalha() {

  describe('Alterar um usuário com sucesso - 422', () => {

    response = url.put('users/324979', payload_updateUser_failed, { headers });
    console.log("Update " + id);
    //console.log(response);   
    describe('Validar resposta da alteração', () => {
      expect(response.status, 'Response is 422').to.equal(422)
      expect(response).to.have.validJsonBody()


    })
    sleep(5)
  })

}

export default function suiteTestScenario2() {
  console.log(response)
  headers.Bearer = response.access_token
  CriarParaFalha();
  ValidarUsuarioCriado();
  AlterarComFalha();
  sleep(3)
}