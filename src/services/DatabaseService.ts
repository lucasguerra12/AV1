import * as fs from 'fs';
import { Aeronave } from '../models/Aeronave.js';
import { Funcionario } from '../models/Funcionario.js';
import { Peca } from '../models/Peca.js';
import { Etapa } from '../models/Etapa.js';
import { Teste } from '../models/Teste.js';

interface Database {
    aeronaves: any[];
    funcionarios: any[];
}

export class DatabaseService {
    private readonly dbPath = './database.json';

    public carregarDados(): { aeronaves: Aeronave[], funcionarios: Funcionario[] } {
        try {
            if (fs.existsSync(this.dbPath)) {
                const dadosJson = fs.readFileSync(this.dbPath, 'utf-8');
                const dados: Database = JSON.parse(dadosJson);
                
                const aeronaves = dados.aeronaves.map(a => {
                    const aeronave = new Aeronave(a.codigo, a.modelo, a.tipo, a.capacidade, a.alcance);
                    aeronave.pecas = a.pecas.map((p: any) => new Peca(p.nome, p.tipo, p.fornecedor));
                    aeronave.etapas = a.etapas.map((e: any) => {
                        const etapa = new Etapa(e.nome, new Date(e.prazo));
                        etapa.status = e.status;
                        return etapa;
                    });
                    aeronave.testes = a.testes.map((t: any) => new Teste(t.tipo, t.resultado));
                    return aeronave;
                });

                const funcionarios = dados.funcionarios.map(f => new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.email, f.senha, f.nivelPermissao));

                console.log('Dados carregados com sucesso.');
                return { aeronaves, funcionarios };
            }
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
        return { aeronaves: [], funcionarios: [] };
    }

    // Salva os dados no ficheiro JSON
    public salvarDados(aeronaves: Aeronave[], funcionarios: Funcionario[]): void {
        const dadosParaSalvar: Database = {
            aeronaves: aeronaves,
            funcionarios: funcionarios.map(f => {
                const { senha, ...resto } = f as any;
                return resto;
            })
        };

        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(dadosParaSalvar, null, 2), 'utf-8');
        } catch (error) {
            console.error('Erro ao salvar os dados:', error);
        }
    }
}