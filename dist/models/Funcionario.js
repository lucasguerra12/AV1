import { NivelPermissao } from "./enums.js";
export class Funcionario {
    id;
    nome;
    telefone;
    endereco;
    usuario;
    nivelPermissao;
    senha;
    constructor(id, nome, telefone, endereco, usuario, senha, nivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }
    // Método para verificar se o usuário e a senha correspondem
    autenticar(usuario, senha) {
        return this.usuario === usuario && this.senha === senha;
    }
}
//# sourceMappingURL=Funcionario.js.map