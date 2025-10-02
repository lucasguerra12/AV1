import { Aeronave } from '../models/Aeronave.js';
import { Funcionario } from '../models/Funcionario.js';
export declare class DatabaseService {
    private readonly dbPath;
    carregarDados(): {
        aeronaves: Aeronave[];
        funcionarios: Funcionario[];
    };
    salvarDados(aeronaves: Aeronave[], funcionarios: Funcionario[]): void;
}
//# sourceMappingURL=DatabaseService.d.ts.map