import { TipoAeronave } from './enums.js';
import { Peca } from './Peca.js';
import { Etapa } from './Etapa.js';
import { Teste } from './Teste.js';
export declare class Aeronave {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
    pecas: Peca[];
    etapas: Etapa[];
    testes: Teste[];
    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number);
    adicionarPeca(peca: Peca): void;
    adicionarEtapa(etapa: Etapa): void;
    adicionarTeste(teste: Teste): void;
    detalhes(): void;
}
//# sourceMappingURL=Aeronave.d.ts.map