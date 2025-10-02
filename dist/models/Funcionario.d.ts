import { NivelPermissao } from "./enums.js";
export declare class Funcionario {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    email: string;
    nivelPermissao: NivelPermissao;
    private senha;
    constructor(id: number, nome: string, telefone: string, endereco: string, email: string, senha: string, nivelPermissao: NivelPermissao);
    autenticar(email: string, senha: string): boolean;
}
//# sourceMappingURL=Funcionario.d.ts.map