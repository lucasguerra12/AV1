
import { NivelPermissao } from "./enums.js";

export class Funcionario {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    email: string; // Adicionado para corresponder ao uso
    private senha: string;
    nivelPermissao: NivelPermissao;

    constructor(id: number, nome: string, telefone: string, endereco: string, email: string, senha?: string, nivelPermissao?: NivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.email = email;
        this.senha = senha || ''; // Garante que a senha seja uma string
        this.nivelPermissao = nivelPermissao || NivelPermissao.OPERADOR;
    }

    /**
     * CORREÇÃO: O método agora verifica apenas a senha.
     * A busca do funcionário pelo email deve ser feita antes de chamar este método.
     * Esta é uma prática mais segura e com melhor separação de responsabilidades.
     */
    autenticar(senhaDigitada: string): boolean {
        return this.senha === senhaDigitada;
    }
}