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


function DeletarComFalha() {

  describe('Excluir um usuário com sucesso - 404', () => {
    console.log()

    response = url.delete('users/331682', null, { headers });

    describe('Validar status', () => {
      expect(response.status, 'Response is 404').to.equal(404)

    })
  })

}

function ValidarDeleteComFalha() {

  describe('Consultar um usuário com ID - Sucesso - 404', () => {

    response = url.get('users/331682', null, { headers });
    //console.log(response);
    describe('Consultar usuário criado - ok', () => {
      expect(response.status, 'Response is 404').to.equal(404)
    })
  })
}

export default function suiteTestDeleteFailed() {
  console.log(response)
  headers.Bearer = response.access_token
  DeletarComFalha();
  ValidarDeleteComFalha();
  sleep(3)
}
