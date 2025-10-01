import { StatusEtapa } from "./enums.js";
import { Funcionario } from "./Funcionario.js";
export declare class Etapa {
    nome: string;
    prazo: Date;
    status: StatusEtapa;
    funcionarios: Funcionario[];
    constructor(nome: string, prazo: Date);
    iniciarEtapa(): void;
    finalizarEtapa(): void;
    associarFuncionario(funcionario: Funcionario): void;
    listarFuncionarios(): void;
}
//# sourceMappingURL=Etapa.d.ts.map