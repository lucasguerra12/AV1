// Em: src/models/Funcionario.ts
import { NivelPermissao } from "./enums.js";
export class Funcionario {
    id;
    nome;
    telefone;
    endereco;
    email;
    nivelPermissao;
    senha;
    constructor(id, nome, telefone, endereco, email, senha, nivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.email = email;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }
    autenticar(email, senha) {
        return this.email === email && this.senha === senha;
    }
}
//# sourceMappingURL=Funcionario.js.map