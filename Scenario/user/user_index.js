import {group, sleep} from "k6";
import testeSuiteScenario1 from "./scenario1.js";
import testeSuiteScenario2 from "./scenario2.js";

export let options = {
  thresholds: {
      checks: [{ threshold: 'rate == 8.00', abortOnFail: true }], //checks: O testes só tem sucesso se todos os testes passarem
      http_req_failed: [{ threshold: 'rate == 0.00', abortOnFail: true }], //abortOnFail: em caso de falha o teste para 
  },
  vus: 1,
  iterations: 1,
};

function CenarioDeTeste () {
    group('Testar Cenários de Sucesso', function () {
      testeSuiteScenario1();
      sleep(3)
    });
    group('Testar Cenários com Falha', function () {
      testeSuiteScenario2();
      sleep(3)
    });
 
  }

  export default function testSuiteSucessful() {
    //console.log(response)
    CenarioDeTeste(); 
    sleep(3)
  }