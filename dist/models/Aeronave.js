import { TipoAeronave } from './enums.js';
import { Peca } from './Peca.js'; // Agora podemos importar a classe Peca
// import { Etapa } from './Etapa.js';
// import { Teste } from './Teste.js';
export class Aeronave {
    codigo;
    modelo;
    tipo;
    capacidade;
    alcance;
    // Relacionamentos: descomentamos a lista de peças
    pecas = [];
    // etapas: Etapa[] = [];
    // testes: Teste[] = [];
    constructor(codigo, modelo, tipo, capacidade, alcance) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
    }
    // Novo método para adicionar uma peça à lista da aeronave
    adicionarPeca(peca) {
        this.pecas.push(peca);
        console.log(`Peça '${peca.nome}' adicionada à aeronave ${this.codigo}.`);
    }
    detalhes() {
        console.log(`\n--- Detalhes da Aeronave [${this.codigo}] ---`);
        console.log(`Modelo: ${this.modelo}`);
        console.log(`Tipo: ${this.tipo}`);
        console.log(`Capacidade: ${this.capacidade} passageiros`);
        console.log(`Alcance: ${this.alcance} km`);
        // Exibindo as peças associadas
        if (this.pecas.length > 0) {
            console.log("Peças Associadas:");
            this.pecas.forEach(peca => {
                console.log(`  - ${peca.nome} (${peca.fornecedor}) - Status: ${peca.status}`);
            });
        }
        else {
            console.log("Nenhuma peça associada ainda.");
        }
    }
}
//# sourceMappingURL=Aeronave.js.map