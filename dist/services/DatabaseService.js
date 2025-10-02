// Em: src/services/DatabaseService.ts
import * as fs from 'fs';
import { Aeronave } from '../models/Aeronave.js';
import { Funcionario } from '../models/Funcionario.js';
import { Peca } from '../models/Peca.js';
import { Etapa } from '../models/Etapa.js';
import { Teste } from '../models/Teste.js';
import { NivelPermissao } from '../models/enums.js';
export class DatabaseService {
    dbPath = './database.json';
    carregarDados() {
        try {
            if (fs.existsSync(this.dbPath)) {
                const dadosJson = fs.readFileSync(this.dbPath, 'utf-8');
                const dados = JSON.parse(dadosJson);
                // Agora, 'f' tem o tipo FuncionarioData, e o erro desaparece
                const funcionarios = dados.funcionarios.map(f => new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.email, f.senha || '', f.nivelPermissao));
                const aeronaves = dados.aeronaves.map(a => {
                    const aeronave = new Aeronave(a.codigo, a.modelo, a.tipo, a.capacidade, a.alcance);
                    aeronave.pecas = (a.pecas || []).map((p) => {
                        const peca = new Peca(p.nome, p.tipo, p.fornecedor);
                        peca.status = p.status;
                        return peca;
                    });
                    aeronave.etapas = (a.etapas || []).map((e) => {
                        const etapa = new Etapa(e.nome, new Date(e.prazo));
                        etapa.status = e.status;
                        etapa.funcionarios = (e.funcionarios || []).map((funcId) => funcionarios.find(f => f.id === funcId)).filter((f) => !!f);
                        return etapa;
                    });
                    aeronave.testes = (a.testes || []).map((t) => new Teste(t.tipo, t.resultado));
                    return aeronave;
                });
                console.log('Dados carregados com sucesso do database.json.');
                return { aeronaves, funcionarios };
            }
        }
        catch (error) {
            console.error('Erro ao carregar os dados do database.json:', error);
        }
        return { aeronaves: [], funcionarios: [] };
    }
    salvarDados(aeronaves, funcionarios) {
        const dadosParaSalvar = {
            aeronaves: aeronaves.map(aeronave => ({
                ...aeronave,
                etapas: aeronave.etapas.map(etapa => ({
                    ...etapa,
                    funcionarios: etapa.funcionarios.map(f => f.id)
                }))
            })),
            funcionarios: funcionarios
        };
        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(dadosParaSalvar, null, 2), 'utf-8');
        }
        catch (error) {
            console.error('Erro ao salvar os dados:', error);
        }
    }
}
//# sourceMappingURL=DatabaseService.js.map