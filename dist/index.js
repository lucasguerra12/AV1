// Em: src/index.ts
import * as readline from 'readline';
import { Aeronave } from './models/Aeronave.js';
import { Peca } from './models/Peca.js';
import { Etapa } from './models/Etapa.js';
// Futuramente, precisaremos do Funcionário para associar às etapas
// import { Funcionario } from './models/Funcionario.js'; 
import * as enums from './models/enums.js';
class App {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    aeronaves = [];
    askQuestion(query) {
        return new Promise(resolve => this.rl.question(query, resolve));
    }
    start() {
        console.log('--- Bem-vindo ao Sistema AeroCode ---');
        this.exibirMenuPrincipal();
    }
    exibirMenuPrincipal() {
        console.log(`
        \n--- MENU PRINCIPAL ---
        1. Cadastrar nova Aeronave
        2. Listar Aeronaves
        3. Gerenciar Aeronave Específica
        4. Sair
        `);
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.cadastrarAeronave();
                    break;
                case '2':
                    this.listarAeronaves();
                    break;
                case '3':
                    this.selecionarAeronave();
                    break;
                case '4':
                    console.log('Saindo do sistema. Até logo!');
                    this.rl.close();
                    break;
                default:
                    console.log('Opção inválida! Tente novamente.');
                    this.exibirMenuPrincipal();
                    break;
            }
        });
    }
    listarAeronaves() {
        console.log('\n--- Lista de Aeronaves Cadastradas ---');
        if (this.aeronaves.length === 0) {
            console.log('Nenhuma aeronave cadastrada.');
        }
        else {
            this.aeronaves.forEach(a => console.log(`- Código: ${a.codigo}, Modelo: ${a.modelo}`));
        }
        this.exibirMenuPrincipal();
    }
    async selecionarAeronave() {
        const codigo = await this.askQuestion('Digite o código da aeronave que deseja gerenciar: ');
        const aeronave = this.aeronaves.find(a => a.codigo === codigo);
        if (aeronave) {
            this.exibirSubMenuGerenciamento(aeronave);
        }
        else {
            console.log('Aeronave não encontrada.');
            this.exibirMenuPrincipal();
        }
    }
    exibirSubMenuGerenciamento(aeronave) {
        console.log(`
        \n--- Gerenciando Aeronave: ${aeronave.modelo} (${aeronave.codigo}) ---
        1. Ver Detalhes Completos
        2. Adicionar Peça
        3. Adicionar Etapa de Produção
        // Futuras opções: Gerenciar Etapas, Adicionar Teste, Gerar Relatório
        9. Voltar ao Menu Principal
        `);
        this.rl.question('Escolha uma ação: ', (opcao) => {
            switch (opcao) {
                case '1':
                    aeronave.detalhes();
                    this.exibirSubMenuGerenciamento(aeronave);
                    break;
                case '2':
                    this.adicionarPeca(aeronave);
                    break;
                case '3':
                    this.adicionarEtapa(aeronave);
                    break;
                case '9':
                    this.exibirMenuPrincipal();
                    break;
                default:
                    console.log('Opção inválida!');
                    this.exibirSubMenuGerenciamento(aeronave);
                    break;
            }
        });
    }
    // --- Funções do Sub-Menu ---
    async adicionarPeca(aeronave) {
        console.log('\n--- Adicionar Nova Peça ---');
        const nome = await this.askQuestion('Nome da peça: ');
        const tipoStr = await this.askQuestion('Tipo (1 para NACIONAL, 2 para IMPORTADA): ');
        const tipo = tipoStr === '1' ? enums.TipoPeca.NACIONAL : enums.TipoPeca.IMPORTADA;
        const fornecedor = await this.askQuestion('Fornecedor: ');
        const novaPeca = new Peca(nome, tipo, fornecedor);
        aeronave.adicionarPeca(novaPeca);
        console.log(`\nPeça '${nome}' adicionada com sucesso à aeronave ${aeronave.codigo}!`);
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async adicionarEtapa(aeronave) {
        console.log('\n--- Adicionar Nova Etapa de Produção ---');
        const nome = await this.askQuestion('Nome da etapa: ');
        const prazoStr = await this.askQuestion('Prazo de conclusão (formato AAAA-MM-DD): ');
        const prazo = new Date(prazoStr);
        // Validação simples da data
        if (isNaN(prazo.getTime())) {
            console.log('Erro: Formato de data inválido. Use AAAA-MM-DD.');
        }
        else {
            const novaEtapa = new Etapa(nome, prazo);
            aeronave.adicionarEtapa(novaEtapa);
            console.log(`\nEtapa '${nome}' adicionada com sucesso!`);
        }
        this.exibirSubMenuGerenciamento(aeronave);
    }
    // --- Função do Menu Principal (sem alterações) ---
    async cadastrarAeronave() {
        console.log('\n--- Cadastro de Nova Aeronave ---');
        const codigo = await this.askQuestion('Digite o código da aeronave: ');
        const codigoExistente = this.aeronaves.find(a => a.codigo === codigo);
        if (codigoExistente) {
            console.log('Erro: Já existe uma aeronave com este código.');
            this.exibirMenuPrincipal();
            return;
        }
        const modelo = await this.askQuestion('Digite o modelo: ');
        const tipoStr = await this.askQuestion('Digite o tipo (1 para COMERCIAL, 2 para MILITAR): ');
        const tipo = tipoStr === '1' ? enums.TipoAeronave.COMERCIAL : enums.TipoAeronave.MILITAR;
        const capacidadeStr = await this.askQuestion('Digite a capacidade de passageiros: ');
        const capacidade = parseInt(capacidadeStr);
        const alcanceStr = await this.askQuestion('Digite o alcance (km): ');
        const alcance = parseInt(alcanceStr);
        if (isNaN(capacidade) || isNaN(alcance)) {
            console.log('Erro: Capacidade e Alcance devem ser números válidos.');
            this.exibirMenuPrincipal();
            return;
        }
        const novaAeronave = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
        this.aeronaves.push(novaAeronave);
        console.log(`\nAeronave '${novaAeronave.modelo}' cadastrada com sucesso!`);
        this.exibirMenuPrincipal();
    }
}
const app = new App();
app.start();
//# sourceMappingURL=index.js.map