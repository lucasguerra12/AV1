// Em: src/models/Funcionario.ts
import { NivelPermissao } from "./enums.js";

export class Funcionario {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    email: string; 
    nivelPermissao: NivelPermissao;
    private senha: string;

    constructor(id: number, nome: string, telefone: string, endereco: string, email: string, senha: string, nivelPermissao: NivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.email = email; 
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }

    autenticar(email: string, senha: string): boolean {
        return this.email === email && this.senha === senha;
    }
}