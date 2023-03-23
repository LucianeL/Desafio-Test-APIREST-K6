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
let payload_createUser_Fail = open('./resources/create_user_fail.json');
let id = '';
export let UserId;

function createUserFail() {

  describe('Criar um usuário com email repetido - 422', () => { 
    
    response = url.post('users/', payload_createUser_Fail, { headers });

    describe('Validar resposta', () => {
      expect(response.status, 'Response is 422').to.equal(422)
      expect(response).to.have.validJsonBody();
     
    })
  })

}

export default function suiteTestScenario2() {
  console.log(response)
  headers.Bearer = response.access_token
  createUserFail();
  sleep(3)
}
