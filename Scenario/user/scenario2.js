import { describe, expect, chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.6/index.js';
import { sleep } from "k6";
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
let payload_updateUser_failed = open('./resources/update_user_failed.json');
let payload_createUser_Fail = open('./resources/create_user_failed.json');
let id = '';


//Cenários Negativos
function buscarUsuarioInexistente(userNoID) {

  describe('Quando eu busco um ID não cadastrado', () => {

      response = url.get('users/' + userNoID, null, { headers });
      describe('Então eu recebo a mensagem de recurso não encontrado', () => {
          expect(response.json(), 'Chaves JSON validadas').to.include.keys('message')
          expect(response.status, 'Resposta é 404').to.equal(404)
          expect(JSON.parse(response.body).message, 'Validar mensagem').to.equal("Resource not found");
      })
  })
}

function criarUsuarioCadastrado() {

  describe('Quando eu crio um usuário com email repetido', () => {

    response = url.post('users/', payload_createUser_Fail, { headers });

    describe('Então recebo a resposta de insucesso', () => {
      expect(response.status, 'Resposta é 422').to.equal(422)
      expect(response).to.have.validJsonBody();
    })
  })
}

function AlterarComBodyVazio() {

  describe('Quando eu altero usuário com o JSON vazio', () => {
    

    response = url.put('users/379597', payload_updateUser_failed, { headers });
    //console.log("Update " + id);
    //console.log(response);   
    describe('Então eu recebo resposta que não pode ser vazio', () => {
      expect(response.status, 'Response is 422').to.equal(422)
      expect(response).to.have.validJsonBody()


    })
    sleep(5)
  })
}

function DeletarSemAutorizacao() {

  describe('Quando eu excluo um usuário sem autorização', () => {
    console.log()
    response = url.delete('users/379597', null, null);

    describe('Então recebo a resposta que ele não existe', () => {
      expect(response.status, 'Resposta é 401').to.equal(401)
      expect(JSON.parse(response.body).message, 'Validar mensagem').to.equal("Authentication failed");

    })
  })

}

export default function testeSuiteScenario2() {
  console.log(response)
  headers.Bearer = response.access_token
  buscarUsuarioInexistente('24512153');
  criarUsuarioCadastrado();
  AlterarComBodyVazio();
  DeletarSemAutorizacao();
  sleep(3)
}
