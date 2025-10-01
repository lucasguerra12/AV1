import { TipoAeronave } from './enums.js';
import { Peca } from './Peca.js';
import { Etapa } from './Etapa.js'; 

export class Aeronave {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;

    pecas: Peca[] = [];
    etapas: Etapa[] = [];

    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
    }
    
    adicionarPeca(peca: Peca): void {
        this.pecas.push(peca);
    }

    adicionarEtapa(etapa: Etapa): void {
        this.etapas.push(etapa);
    }

    detalhes(): void {
        console.log(`\n--- Detalhes da Aeronave [${this.codigo}] ---`);
        console.log(`Modelo: ${this.modelo}`);
        console.log(`Tipo: ${this.tipo}`);
        console.log(`Capacidade: ${this.capacidade} passageiros`);
        console.log(`Alcance: ${this.alcance} km`);

        if (this.pecas.length > 0) {
            console.log("Peças Associadas:");
            this.pecas.forEach(p => console.log(`  - ${p.nome} (${p.fornecedor}) - Status: ${p.status}`));
        } else {
            console.log("Nenhuma peça associada ainda.");
        }

        if (this.etapas.length > 0) {
            console.log("Etapas de Produção:");
            this.etapas.forEach(e => console.log(`  - ${e.nome} (Prazo: ${e.prazo.toLocaleDateString()}) - Status: ${e.status}`));
        } else {
            console.log("Nenhuma etapa de produção iniciada.");
        }
    }
}