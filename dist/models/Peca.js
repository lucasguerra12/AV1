import { TipoPeca, StatusPeca } from "./enums.js";
export class Peca {
    nome;
    tipo;
    fornecedor;
    status;
    constructor(nome, tipo, fornecedor) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        // Toda nova peça começa com o status "Em Produção" por padrão
        this.status = StatusPeca.EM_PRODUCAO;
    }
    // Método para atualizar o status da peça
    atualizarStatus(novoStatus) {
        this.status = novoStatus;
        console.log(`O status da peça '${this.nome}' foi atualizado para: ${this.status}`);
    }
}
//# sourceMappingURL=Peca.js.map