import { TipoPeca, StatusPeca } from "./enums.js";
export declare class Peca {
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;
    constructor(nome: string, tipo: TipoPeca, fornecedor: string);
    atualizarStatus(novoStatus: StatusPeca): void;
}
//# sourceMappingURL=Peca.d.ts.map