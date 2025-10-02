import { NivelPermissao } from "./enums.js";
export declare class Funcionario {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    email: string;
    private senha;
    nivelPermissao: NivelPermissao;
    constructor(id: number, nome: string, telefone: string, endereco: string, email: string, senha?: string, nivelPermissao?: NivelPermissao);
    /**
     * CORREÇÃO: O método agora verifica apenas a senha.
     * A busca do funcionário pelo email deve ser feita antes de chamar este método.
     * Esta é uma prática mais segura e com melhor separação de responsabilidades.
     */
    autenticar(senhaDigitada: string): boolean;
}
//# sourceMappingURL=Funcionario.d.ts.map