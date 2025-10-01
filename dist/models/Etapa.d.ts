import { StatusEtapa } from "./enums.js";
export declare class Etapa {
    nome: string;
    prazo: Date;
    status: StatusEtapa;
    constructor(nome: string, prazo: Date);
    iniciarEtapa(): void;
    finalizarEtapa(): void;
}
//# sourceMappingURL=Etapa.d.ts.map