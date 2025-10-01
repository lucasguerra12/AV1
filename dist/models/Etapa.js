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
        }
    }
    finalizarEtapa() {
        if (this.status === StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA;
        }
    }
    associarFuncionario(funcionario) {
        const jaAssociado = this.funcionarios.find(f => f.id === funcionario.id);
        if (!jaAssociado) {
            this.funcionarios.push(funcionario);
            console.log(`Funcionario '${funcionario.nome}' associado à etapa '${this.nome}'.`);
        }
        else {
            console.log(`Funcionario '${funcionario.nome}' já está associado a esta etapa.`);
        }
    }
    listarFuncionarios() {
        console.log(`\n--- Funcionários da Etapa: ${this.nome} ---`);
        if (this.funcionarios.length > 0) {
            this.funcionarios.forEach(f => console.log(`  - ID: ${f.id}, Nome: ${f.nome}, Nível: ${f.nivelPermissao}`));
        }
        else {
            console.log("Nenhum funcionário associado a esta etapa.");
        }
    }
}
//# sourceMappingURL=Etapa.js.map