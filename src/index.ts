import { Aeronave } from './models/Aeronave.js';
import { Peca } from './models/Peca.js';
import { Etapa } from './models/Etapa.js';
import { TipoAeronave, TipoPeca, StatusPeca } from './models/enums.js';

console.log("--- Sistema da AeroCode em execução ---\n");

const bandeirante = new Aeronave('EMB-110', 'Bandeirante', TipoAeronave.COMERCIAL, 18, 1900);

const turbina = new Peca("Turbina PT6A", TipoPeca.IMPORTADA, "Pratt & Whitney");
const asa = new Peca("Asa Direita", TipoPeca.NACIONAL, "Embraer Metálica");
bandeirante.adicionarPeca(turbina);
bandeirante.adicionarPeca(asa);
turbina.atualizarStatus(StatusPeca.PRONTA);

const etapaFuselagem = new Etapa("Montagem da Fuselagem", new Date("2025-10-20"));
const etapaAsas = new Etapa("Instalação das Asas", new Date("2025-10-25"));
const etapaMotores = new Etapa("Instalação dos Motores", new Date("2025-11-05"));
bandeirante.adicionarEtapa(etapaFuselagem);
bandeirante.adicionarEtapa(etapaAsas);
bandeirante.adicionarEtapa(etapaMotores);
etapaFuselagem.iniciarEtapa();
etapaFuselagem.finalizarEtapa();
etapaAsas.iniciarEtapa();

// Exibindo o estado final da aeronave
bandeirante.detalhes();