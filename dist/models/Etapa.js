// Em: src/models/Etapa.ts
import { StatusEtapa } from "./enums.js";
import { Funcionario } from "./Funcionario.js";
export class Etapa {
    nome;
    prazo;
    status;
    funcionarios = [];
    constructor(nome, prazo) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = StatusEtapa.PENDENTE;
    }
    iniciarEtapa() {
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.ANDAMENTO;
            console.log(`Etapa '${this.nome}' iniciada.`);
        }
        else {
            console.log(`Aviso: Etapa '${this.nome}' não pôde ser iniciada (Status atual: ${this.status}).`);
        }
    }
    finalizarEtapa() {
        if (this.status === StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA;
            console.log(`Etapa '${this.nome}' foi concluída!`);
        }
        else {
            console.log(`Aviso: Etapa '${this.nome}' não pôde ser finalizada (Status atual: ${this.status}).`);
        }
    }
    associarFuncionario(funcionario) {
        if (!this.funcionarios.find(f => f.id === funcionario.id)) {
            this.funcionarios.push(funcionario);
            console.log(`Funcionário '${funcionario.nome}' associado à etapa '${this.nome}'.`);
        }
        else {
            console.log(`Aviso: Funcionário '${funcionario.nome}' já está associado a esta etapa.`);
        }
    }
}
//# sourceMappingURL=Etapa.js.map