
import { Aeronave } from './models/Aeronave.js';
import { Peca } from './models/Peca.js';
import { Etapa } from './models/Etapa.js';
import { Funcionario } from './models/Funcionario.js';
import { Teste } from './models/Teste.js';
import { Relatorio } from './models/Relatorio.js';
import { TipoAeronave, TipoPeca, StatusPeca, NivelPermissao, TipoTeste, ResultadoTeste } from './models/enums.js';

console.log("--- Sistema da AeroCode em execução ---\n");

const bandeirante = new Aeronave('EMB-110', 'Bandeirante', TipoAeronave.COMERCIAL, 18, 1900);

const turbina = new Peca("Turbina PT6A", TipoPeca.IMPORTADA, "Pratt & Whitney");
bandeirante.adicionarPeca(turbina);

const etapaAsas = new Etapa("Instalação das Asas", new Date("2025-10-25"));
bandeirante.adicionarEtapa(etapaAsas);
etapaAsas.iniciarEtapa();

const engChefe = new Funcionario(1, "Ana Silva", "12999998888", "Rua A, 10", "ana.silva", "senha123", NivelPermissao.ENGENHEIRO);
etapaAsas.associarFuncionario(engChefe);

const testeEletrico = new Teste(TipoTeste.ELETRICO, ResultadoTeste.APROVADO);
const testeHidraulico = new Teste(TipoTeste.HIDRAULICO, ResultadoTeste.APROVADO);
bandeirante.adicionarTeste(testeEletrico);
bandeirante.adicionarTeste(testeHidraulico);
bandeirante.detalhes();

// --- 3. GERAÇÃO DO RELATÓRIO FINAL EM ARQUIVO ---
const relatorioFinal = new Relatorio();
relatorioFinal.salvar(bandeirante, "Força Aérea Brasileira");