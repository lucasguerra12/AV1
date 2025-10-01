import { Aeronave } from './models/Aeronave.js';
import { Peca } from './models/Peca.js';
import { Etapa } from './models/Etapa.js';
import { Funcionario } from './models/Funcionario.js';
import { TipoAeronave, TipoPeca, StatusPeca, NivelPermissao } from './models/enums.js';
console.log("--- Sistema da AeroCode em execução ---\n");
const bandeirante = new Aeronave('EMB-110', 'Bandeirante', TipoAeronave.COMERCIAL, 18, 1900);
const turbina = new Peca("Turbina PT6A", TipoPeca.IMPORTADA, "Pratt & Whitney");
bandeirante.adicionarPeca(turbina);
const etapaFuselagem = new Etapa("Montagem da Fuselagem", new Date("2025-10-20"));
const etapaAsas = new Etapa("Instalação das Asas", new Date("2025-10-25"));
bandeirante.adicionarEtapa(etapaFuselagem);
bandeirante.adicionarEtapa(etapaAsas);
etapaFuselagem.finalizarEtapa();
etapaAsas.iniciarEtapa();
// Criando funcionários
const engChefe = new Funcionario(1, "Ana Silva", "12999998888", "Rua A, 10", "ana.silva", "senha123", NivelPermissao.ENGENHEIRO);
const operador1 = new Funcionario(2, "Beto Costa", "12988887777", "Rua B, 20", "beto.costa", "abc456", NivelPermissao.OPERADOR);
// Associando funcionários
etapaAsas.associarFuncionario(engChefe);
etapaAsas.associarFuncionario(operador1);
etapaAsas.associarFuncionario(engChefe);
etapaAsas.listarFuncionarios();
// Exibindo o estado final da aeronave
bandeirante.detalhes();
//# sourceMappingURL=index.js.map