import criarUsuarioSucesso from "./postSuccessful.js";
import listarUsuarioSucesso from "./getSuccessful.js";
import alterarUsuarioSucesso from "./putSuccessful.js";
import deletarUsuarioSucesso from "./deleteSuccessful.js";

function CenarioSucesso () {
    group('Criar usuário', function () {
      criarUsuarioSucesso();
      sleep(3)
    });
    group('Listar Usuários', function () {
      listarUsuarioSucesso();
      sleep(3)
    });
    group('Alterar Usuário', function () {
      alterarUsuarioSucesso();
      sleep(3)
    });
    group('Deletar Usuário', function () {
      deletarUsuarioSucesso();
      sleep(3)
    });
  }

  export default function testSuiteSucessful() {
    console.log(response)
    CenarioSucesso(); 
    sleep(3)
  }