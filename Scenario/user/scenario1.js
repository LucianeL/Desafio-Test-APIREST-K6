import { describe, expect, chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.6/index.js';
import { sleep } from "k6";
import TokenAuth from "../utils/authorization.js"

chai.config.logFailures = true;

//Configurações do teste.
export let options = {
  thresholds: {
    checks: [{ threshold: 'rate == 1.00', abortOnFail: true }],
    //http_req_failed: [{ threshold: 'rate == 0.00', abortOnFail: true }],
  },
  vus: 1,
  iterations: 1,
};

//Requisições/Headers
let headers = TokenAuth();
let url = new Httpx({ baseURL: 'https://gorest.co.in/public/v2/' });
let response = '';
let payload_create = open('./resources/create_user.json');
let payload_updateUser = open('./resources/update_user.json');
let payload_updateUser_failed = open('./resources/update_user_failed.json');
let id = '';

//Cenários Positivos
function testeListar() {

  describe('Quando verifico o funcionamento da rota raiz - Listar todos', () => {

    response = url.get('users', null, { headers });
    describe('Então recebo resposta de sucesso', () => {
      expect(response.status, 'Resposta 200 - Ok').to.equal(200);
      expect(response, 'Resposta é um JSON válido').to.have.validJsonBody();
      sleep(3)
    })
  })
}


function CriarUsuario() {

  describe('Quando eu crio um usuário - 201', () => {

    response = url.post('users/', payload_create, { headers });
    console.log("Post");
    //console.log(response);
    describe('Então recebo a resposta da criação do usuário com sucesso', () => {
      expect(response.status, 'Resposta é 201').to.equal(201)
      expect(response, 'Resposta é um JSON válido').to.have.validJsonBody()
      expect(response.json(), 'Chaves JSON validadas').to.include.keys('id', 'name', 'email', 'gender', 'status');
      id = JSON.parse(response.body).id;
      sleep(3)
    })
    response = url.get(`users/${id}`, null, { headers });
    console.log("Get " + id);
    //console.log(response);
    describe('Então recebo a resposta da consulta com sucesso', () => {
      expect(response.status, 'Resposta é 200').to.equal(200)
      expect(response, 'Resposta é um JSON válido').to.have.validJsonBody()
      expect(response.json(), 'Chaves JSON validadas').to.include.keys('id', 'name', 'email', 'gender', 'status');
    })
    sleep(3)
  })
}

function AlterarUsuarioCriado() {

  describe('Quando eu altero o usuário', () => {

    response = url.put(`users/${id}`, payload_updateUser, { headers });
    console.log("Update " + id);
    //console.log(response);   
    describe('Então recebo a resposta da alteração realizada com sucesso', () => {
      expect(response.status, 'Resposta é 200').to.equal(200)
      expect(response, 'Resposta é um JSON válido').to.have.validJsonBody()
      expect(response.json(), 'Chaves JSON validadas').to.include.keys('id', 'name', 'email', 'gender', 'status');
      sleep(3)
    })

    describe('Quando busco pelo ID alterado', () => {

      response = url.get(`users/${id}`, null, { headers });
      describe('Então recebo resposta de sucesso', () => {
        expect(response.status, 'Resposta 200 - Ok').to.equal(200);
        expect(response, 'Resposta é um JSON válido').to.have.validJsonBody();
        expect(response.json(), 'Chaves JSON validadas').to.include.keys('id', 'name', 'email', 'gender', 'status');
        sleep(3)
      })
    })
    sleep(5)
  })
}

function DeletarSemAutorizacao() {

  describe('Quando eu excluo um usuário sem autorização', () => {
    console.log()
    response = url.delete(`users/${id}`, null, null);

    describe('Então recebo a resposta que ele não existe', () => {
      expect(response.status, 'Resposta é 401').to.equal(401)
      expect(JSON.parse(response.body).message, 'Validar mensagem').to.equal("Authentication failed");

    })
  })
}

function DeletarUsuario() {

  describe('Quando eu excluo um usuário', () => {
    console.log("Deleta " + id)
    response = url.delete(`users/${id}`, null, { headers });

    describe('Então recebo a resposta de sucesso da exclusão', () => {
      expect(response.status, 'Response is 204').to.equal(204)
      sleep(3)
    })
  })
  describe('Quando eu busco o usuário excluído', () => {

    response = url.get(`users/${id}`, null, { headers });
    //console.log(response);
    describe('Então recebo a informação de que ele não foi encontrado', () => {
      expect(response.status, 'Response is 404').to.equal(404)
    })
  })
}

export default function testeSuiteScenario1() {
  console.log(response)
  headers.Bearer = response.access_token
  testeListar();
  CriarUsuario();
  AlterarUsuarioCriado();
  DeletarSemAutorizacao();
  DeletarUsuario();
  sleep(3)
}
