
import { StatusEtapa } from "./enums.js";
import { Funcionario } from "./Funcionario.js";

export class Etapa {
    nome: string;
    prazo: Date;
    status: StatusEtapa;
    funcionarios: Funcionario[] = [];

    constructor(nome: string, prazo: Date) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = StatusEtapa.PENDENTE;
    }

    iniciarEtapa(): void {
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.ANDAMENTO;
        }
    }

    finalizarEtapa(): void {
        if (this.status === StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA;
        }
    }

    associarFuncionario(funcionario: Funcionario): void {
        const jaAssociado = this.funcionarios.find(f => f.id === funcionario.id);
        if (!jaAssociado) {
            this.funcionarios.push(funcionario);
            console.log(`Funcionario '${funcionario.nome}' associado à etapa '${this.nome}'.`);
        } else {
            console.log(`Funcionario '${funcionario.nome}' já está associado a esta etapa.`);
        }
    }

    listarFuncionarios(): void {
        console.log(`\n--- Funcionários da Etapa: ${this.nome} ---`);
        if (this.funcionarios.length > 0) {
            this.funcionarios.forEach(f => console.log(`  - ID: ${f.id}, Nome: ${f.nome}, Nível: ${f.nivelPermissao}`));
        } else {
            console.log("Nenhum funcionário associado a esta etapa.");
        }
    }
}