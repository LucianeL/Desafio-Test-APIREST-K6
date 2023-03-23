import { describe, expect, chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.6/index.js';
import { sleep } from "k6";
import TokenAuth from "../utils/authorization.js"

chai.config.logFailures = true;

//options possui as configurações do teste.
export let options = {
  thresholds: {
    checks: [{ threshold: 'rate == 1.00', abortOnFail: true }],
    //http_req_failed: [{ threshold: 'rate == 0.00', abortOnFail: true }],
  },
  vus: 1,
  iterations: 1,
};

let headers = TokenAuth();
let url = new Httpx({ baseURL: 'https://gorest.co.in/public/v2/' });
let response = '';
let payload_create_user_to_delete = open('./resources/create_user_to_delete.json');
let id = '';

function CriarParaDelete() {

  describe('Criar um usuário com sucesso - 201', () => {

    response = url.post('users/', payload_create_user_to_delete, { headers });
    console.log("Post");
    //console.log(response);
    describe('Validar usuário criado', () => {
      expect(response.status, 'Response is 201').to.equal(201)
      expect(response).to.have.validJsonBody()
      expect(response.json(), 'validate response keys').to.include.keys('id', 'name', 'email', 'gender', 'status');
      id = JSON.parse(response.body).id;
    })
    sleep(5)
  })
}

function ListarUsuarioDelete() {

  describe('Consultar um usuário com ID - Sucesso - 200', () => {

    response = url.get(`users/${id}`, null, { headers });
    console.log("Get " + id);
    //console.log(response);
    describe('Consultar usuário criado - ok', () => {
      expect(response.status, 'Response is 200').to.equal(200)
      expect(response).to.have.validJsonBody()
      expect(response.json(), 'validate response keys').to.include.keys('id', 'name', 'email', 'gender', 'status');
    })
  })
}

function Deletar() {

  describe('Excluir um usuário com sucesso - 204', () => {
    console.log("Deleta " + id)
    response = url.delete(`users/${id}`, null, { headers });

    describe('Validar status', () => {
      expect(response.status, 'Response is 204').to.equal(204)

    })
  })
}

function ValidarDelete() {

  describe('Consultar um usuário com ID - Sucesso - 404', () => {

    response = url.get(`users/${id}`, null, { headers });
    //console.log(response);
    describe('Consultar usuário criado - ok', () => {
      expect(response.status, 'Response is 404').to.equal(404)
    })
  })
}

export default function deletarUsuarioSucesso() {
  console.log(response)
  headers.Bearer = response.access_token
  CriarParaDelete();
  ListarUsuarioDelete();
  Deletar();
  ValidarDelete();
  sleep(3)
}
