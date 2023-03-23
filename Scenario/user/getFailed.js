import { describe, expect, chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.6/index.js';
import { sleep, check } from "k6";
import TokenAuth from "../utils/authorization.js";
import { id } from "./post.js";

chai.config.logFailures = true;

//options tem as configurações do teste.
export let options = {
    thresholds: {
        checks: [{ threshold: 'rate == 1.00', abortOnFail: true }], //checks: O testes só tem sucesso se todos os testes passarem
        http_req_failed: [{ threshold: 'rate == 0.00', abortOnFail: true }], //abortOnFail: em caso de falha o teste para 
    },
    vus: 1,
    iterations: 1,
};

//classe de requisição/headers
let url = new Httpx({ baseURL: 'https://gorest.co.in/public/v2/' });
let headers = TokenAuth();
let response = '';



//Cenário Fracasso
function listarIDInex(userNoID) {

    describe('Consultar um usuário com ID inexistente - 404', () => {

        response = url.get('users/' + userNoID, null, { headers });
        describe('Response - ok', () => {
            expect(response.json(), 'validate response keys').to.include.keys('message')
            expect(response.status, 'Response is 404').to.equal(404)
            expect(JSON.parse(response.body).message, 'validar mensagem').to.equal("Resource not found");
        })
    })
}

export default function suiteTestScenario1() {

    console.log(response)
    headers.Bearer = response.access_token
    listarIDInex('24512153');
    sleep(3)
}