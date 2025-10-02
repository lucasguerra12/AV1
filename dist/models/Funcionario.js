import { NivelPermissao } from "./enums.js";
export class Funcionario {
    id;
    nome;
    telefone;
    endereco;
    email; // Adicionado para corresponder ao uso
    senha;
    nivelPermissao;
    constructor(id, nome, telefone, endereco, email, senha, nivelPermissao) {
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
    autenticar(senhaDigitada) {
        return this.senha === senhaDigitada;
    }
}
//# sourceMappingURL=Funcionario.js.map