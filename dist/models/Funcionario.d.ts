import { NivelPermissao } from "./enums.js";
export declare class Funcionario {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    nivelPermissao: NivelPermissao;
    private senha;
    constructor(id: number, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao);
    autenticar(usuario: string, senha: string): boolean;
}
//# sourceMappingURL=Funcionario.d.ts.map