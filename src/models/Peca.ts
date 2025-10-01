import { TipoPeca, StatusPeca } from "./enums.js";

export class Peca {
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;

    constructor(nome: string, tipo: TipoPeca, fornecedor: string) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        // Toda nova peça começa com o status "Em Produção" por padrão
        this.status = StatusPeca.EM_PRODUCAO;
    }

    // Método para atualizar o status da peça
    atualizarStatus(novoStatus: StatusPeca): void {
        this.status = novoStatus;
        console.log(`O status da peça '${this.nome}' foi atualizado para: ${this.status}`);
    }
}