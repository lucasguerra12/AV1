// Em: src/models/Funcionario.ts
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
    autenticar(usuario, senha) {
        return this.usuario === usuario && this.senha === senha;
    }
}
//# sourceMappingURL=Funcionario.js.map