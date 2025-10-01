import { NivelPermissao } from "./enums.js";

export class Funcionario {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    nivelPermissao: NivelPermissao;
    private senha: string;

    constructor(id: number, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }

    // Método para verificar se o usuário e a senha correspondem
    autenticar(usuario: string, senha: string): boolean {
        return this.usuario === usuario && this.senha === senha;
    }
}