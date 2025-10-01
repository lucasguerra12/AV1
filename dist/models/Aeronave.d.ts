import { TipoAeronave } from './enums.js';
import { Peca } from './Peca.js';
export declare class Aeronave {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
    pecas: Peca[];
    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number);
    adicionarPeca(peca: Peca): void;
    detalhes(): void;
}
//# sourceMappingURL=Aeronave.d.ts.map