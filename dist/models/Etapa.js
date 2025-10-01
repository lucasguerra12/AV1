// Em: src/models/Etapa.ts
import { StatusEtapa } from "./enums.js";
// A classe Funcionario será criada em breve.
// import { Funcionario } from "./Funcionario.js";
export class Etapa {
    nome;
    prazo; // Usaremos o tipo Date para trabalhar com datas
    status;
    // Cada etapa terá uma lista de funcionários responsáveis [cite: 105]
    // funcionarios: Funcionario[] = [];
    constructor(nome, prazo) {
        this.nome = nome;
        this.prazo = prazo;
        // Toda nova etapa começa como "Pendente"
        this.status = StatusEtapa.PENDENTE;
    }
    // Método para iniciar a etapa
    iniciarEtapa() {
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.ANDAMENTO;
            console.log(`Etapa '${this.nome}' iniciada.`);
        }
        else {
            console.log(`Não foi possível iniciar a etapa '${this.nome}', pois seu status atual é: ${this.status}.`);
        }
    }
    // Método para finalizar a etapa
    finalizarEtapa() {
        if (this.status === StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA;
            console.log(`Etapa '${this.nome}' foi concluída com sucesso!`);
        }
        else {
            console.log(`Não foi possível finalizar a etapa '${this.nome}', pois ela não está em andamento.`);
        }
    }
}
//# sourceMappingURL=Etapa.js.map