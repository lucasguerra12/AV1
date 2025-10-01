import { Aeronave } from './models/Aeronave.js';
import { Peca } from './models/Peca.js';
import { TipoAeronave, TipoPeca, StatusPeca } from './models/enums.js';
console.log("--- Sistema da AeroCode em execução ---\n");
// 1. Criando a aeronave
const bandeirante = new Aeronave('EMB-110', 'Bandeirante', TipoAeronave.COMERCIAL, 18, 1900);
// 2. Criando algumas peças
const turbina = new Peca("Turbina PT6A", TipoPeca.IMPORTADA, "Pratt & Whitney");
const asa = new Peca("Asa Direita", TipoPeca.NACIONAL, "Embraer Metálica");
const fuselagem = new Peca("Fuselagem Principal", TipoPeca.NACIONAL, "Embraer Estruturas");
// 3. Adicionando as peças à aeronave
bandeirante.adicionarPeca(turbina);
bandeirante.adicionarPeca(asa);
bandeirante.adicionarPeca(fuselagem);
// 4. Vamos simular que o status de uma peça mudou
turbina.atualizarStatus(StatusPeca.PRONTA);
// 5. Exibindo os detalhes completos da aeronave
bandeirante.detalhes();
//# sourceMappingURL=index.js.map