// Em: src/index.ts
import * as readline from 'readline';
import { Aeronave } from './models/Aeronave.js';
import { Peca } from './models/Peca.js';
import { Etapa } from './models/Etapa.js';
import { Funcionario } from './models/Funcionario.js';
import { Teste } from './models/Teste.js';
import { Relatorio } from './models/Relatorio.js';
import { TipoAeronave, TipoPeca, StatusEtapa, NivelPermissao, TipoTeste, ResultadoTeste } from './models/enums.js';
class App {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    aeronaves = [];
    funcionarios = [];
    relatorio = new Relatorio();
    askQuestion(query) {
        return new Promise(resolve => this.rl.question(query, resolve));
    }
    start() {
        this.funcionarios.push(new Funcionario(1, "Ana Beatriz", "12911112222", "Rua das Flores, 10", "ana.b", "123", NivelPermissao.ENGENHEIRO));
        this.funcionarios.push(new Funcionario(2, "Carlos Drummond", "12933334444", "Av. Brasil, 200", "carlos.d", "456", NivelPermissao.OPERADOR));
        console.log('--- Bem-vindo ao Sistema AeroCode ---');
        this.exibirMenuPrincipal();
    }
    // --- MENUS ---
    exibirMenuPrincipal() {
        console.log(`
        \n--- MENU PRINCIPAL ---
        1. Cadastrar Aeronave
        2. Cadastrar Funcionário
        3. Listar Aeronaves
        4. Listar Funcionários
        5. Gerenciar Aeronave Específica
        9. Sair
        `);
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.cadastrarAeronave();
                    break;
                case '2':
                    this.cadastrarFuncionario();
                    break;
                case '3':
                    this.listarAeronaves();
                    break;
                case '4':
                    this.listarFuncionarios();
                    break;
                case '5':
                    this.selecionarAeronave();
                    break;
                case '9':
                    console.log('Saindo do sistema. Até logo!');
                    this.rl.close();
                    break;
                default:
                    console.log('Opção inválida!');
                    this.exibirMenuPrincipal();
                    break;
            }
        });
    }
    exibirSubMenuGerenciamento(aeronave) {
        console.log(`
        \n--- Gerenciando Aeronave: ${aeronave.modelo} (${aeronave.codigo}) ---
        1. Ver Detalhes Completos
        2. Adicionar Peça
        3. Adicionar Etapa de Produção
        4. Gerenciar Andamento das Etapas
        5. Associar Funcionário a uma Etapa
        6. Adicionar Teste à Aeronave
        7. Gerar Relatório Final
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
                case '4':
                    this.gerenciarEtapas(aeronave);
                    break;
                case '5':
                    this.associarFuncionarioAEtapa(aeronave);
                    break;
                case '6':
                    this.adicionarTeste(aeronave);
                    break;
                case '7':
                    this.gerarRelatorio(aeronave);
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
    // --- FUNÇÕES DE CADASTRO E LISTAGEM ---
    async cadastrarAeronave() {
        console.log('\n--- Cadastro de Nova Aeronave ---');
        const codigo = await this.askQuestion('Código: ');
        if (this.aeronaves.find(a => a.codigo === codigo)) {
            console.log('Erro: Já existe uma aeronave com este código.');
            this.exibirMenuPrincipal();
            return;
        }
        const modelo = await this.askQuestion('Modelo: ');
        const tipoStr = await this.askQuestion('Tipo (1-COMERCIAL, 2-MILITAR): ');
        const tipo = tipoStr === '1' ? TipoAeronave.COMERCIAL : TipoAeronave.MILITAR;
        const capacidade = parseInt(await this.askQuestion('Capacidade de passageiros: '));
        const alcance = parseInt(await this.askQuestion('Alcance (km): '));
        if (isNaN(capacidade) || isNaN(alcance)) {
            console.log('Erro: Capacidade e Alcance devem ser números.');
        }
        else {
            const novaAeronave = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
            this.aeronaves.push(novaAeronave);
            console.log(`\nAeronave '${modelo}' cadastrada com sucesso!`);
        }
        this.exibirMenuPrincipal();
    }
    async cadastrarFuncionario() {
        console.log('\n--- Cadastro de Novo Funcionário ---');
        const id = this.funcionarios.length > 0 ? Math.max(...this.funcionarios.map(f => f.id)) + 1 : 1;
        const nome = await this.askQuestion('Nome: ');
        const telefone = await this.askQuestion('Telefone: ');
        const endereco = await this.askQuestion('Endereço: ');
        const usuario = await this.askQuestion('Usuário de acesso: ');
        const senha = await this.askQuestion('Senha: ');
        const permStr = await this.askQuestion('Permissão (1-Admin, 2-Engenheiro, 3-Operador): ');
        let permissao;
        if (permStr === '1')
            permissao = NivelPermissao.ADMINISTRADOR;
        else if (permStr === '2')
            permissao = NivelPermissao.ENGENHEIRO;
        else
            permissao = NivelPermissao.OPERADOR;
        const novoFunc = new Funcionario(id, nome, telefone, endereco, usuario, senha, permissao);
        this.funcionarios.push(novoFunc);
        console.log(`\nFuncionário '${nome}' cadastrado com sucesso!`);
        this.exibirMenuPrincipal();
    }
    listarAeronaves() {
        console.log('\n--- Aeronaves Cadastradas ---');
        if (this.aeronaves.length === 0)
            console.log('Nenhuma aeronave cadastrada.');
        else
            this.aeronaves.forEach(a => console.log(`- Código: ${a.codigo}, Modelo: ${a.modelo}`));
        this.exibirMenuPrincipal();
    }
    listarFuncionarios() {
        console.log('\n--- Funcionários Cadastrados ---');
        if (this.funcionarios.length === 0)
            console.log('Nenhum funcionário cadastrado.');
        else
            this.funcionarios.forEach(f => console.log(`- ID: ${f.id}, Nome: ${f.nome}, Nível: ${f.nivelPermissao}`));
        this.exibirMenuPrincipal();
    }
    async selecionarAeronave() {
        const codigo = await this.askQuestion('Digite o código da aeronave que deseja gerenciar: ');
        const aeronave = this.aeronaves.find(a => a.codigo === codigo);
        if (aeronave)
            this.exibirSubMenuGerenciamento(aeronave);
        else {
            console.log('Aeronave não encontrada.');
            this.exibirMenuPrincipal();
        }
    }
    // --- FUNÇÕES DE GERENCIAMENTO DE AERONAVE ---
    async adicionarPeca(aeronave) {
        console.log('\n--- Adicionar Nova Peça ---');
        const nome = await this.askQuestion('Nome da peça: ');
        const tipoStr = await this.askQuestion('Tipo (1-NACIONAL, 2-IMPORTADA): ');
        const tipo = tipoStr === '1' ? TipoPeca.NACIONAL : TipoPeca.IMPORTADA;
        const fornecedor = await this.askQuestion('Fornecedor: ');
        aeronave.adicionarPeca(new Peca(nome, tipo, fornecedor));
        console.log(`\nPeça '${nome}' adicionada com sucesso!`);
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async adicionarEtapa(aeronave) {
        console.log('\n--- Adicionar Etapa de Produção ---');
        const nome = await this.askQuestion('Nome da etapa: ');
        const prazoStr = await this.askQuestion('Prazo (AAAA-MM-DD): ');
        const prazo = new Date(prazoStr);
        if (isNaN(prazo.getTime()))
            console.log('Erro: Data inválida.');
        else {
            aeronave.adicionarEtapa(new Etapa(nome, prazo));
            console.log(`\nEtapa '${nome}' adicionada!`);
        }
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async gerenciarEtapas(aeronave) {
        console.log('\n--- Gerenciar Andamento de Etapa ---');
        if (aeronave.etapas.length === 0) {
            console.log('Nenhuma etapa cadastrada.');
            this.exibirSubMenuGerenciamento(aeronave);
            return;
        }
        aeronave.etapas.forEach((e, i) => console.log(`${i}. ${e.nome} - Status: ${e.status}`));
        const index = parseInt(await this.askQuestion('\nNúmero da etapa a alterar: '));
        // CORREÇÃO APLICADA AQUI
        const etapa = aeronave.etapas[index];
        if (!etapa) {
            console.log('Índice de etapa inválido.');
            this.exibirSubMenuGerenciamento(aeronave);
            return;
        }
        const acao = await this.askQuestion(`Ação para '${etapa.nome}' (1-INICIAR, 2-FINALIZAR): `);
        if (acao === '1') {
            if (index > 0 && aeronave.etapas[index - 1]?.status !== StatusEtapa.CONCLUIDA) {
                console.log('Erro: A etapa anterior precisa ser concluída primeiro.');
            }
            else {
                etapa.iniciarEtapa();
            }
        }
        else if (acao === '2') {
            etapa.finalizarEtapa();
        }
        else
            console.log('Ação inválida.');
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async associarFuncionarioAEtapa(aeronave) {
        console.log('\n--- Associar Funcionário a Etapa ---');
        if (this.funcionarios.length === 0 || aeronave.etapas.length === 0) {
            console.log('É necessário ter funcionários e etapas cadastrados.');
            this.exibirSubMenuGerenciamento(aeronave);
            return;
        }
        aeronave.etapas.forEach((e, i) => console.log(`${i}. ${e.nome}`));
        const etIndex = parseInt(await this.askQuestion('Número da etapa: '));
        console.log('');
        this.funcionarios.forEach(f => console.log(`ID: ${f.id} - ${f.nome}`));
        const funcId = parseInt(await this.askQuestion('ID do funcionário: '));
        // CORREÇÃO APLICADA AQUI
        const etapa = aeronave.etapas[etIndex];
        const funcionario = this.funcionarios.find(f => f.id === funcId);
        if (etapa && funcionario) {
            etapa.associarFuncionario(funcionario);
        }
        else {
            console.log('Etapa ou funcionário não encontrado.');
        }
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async adicionarTeste(aeronave) {
        console.log('\n--- Adicionar Resultado de Teste ---');
        const tipoStr = await this.askQuestion('Tipo (1-ELETRICO, 2-HIDRAULICO, 3-AERODINAMICO): ');
        let tipo; // Informa que pode ser undefined
        if (tipoStr === '1')
            tipo = TipoTeste.ELETRICO;
        else if (tipoStr === '2')
            tipo = TipoTeste.HIDRAULICO;
        else if (tipoStr === '3')
            tipo = TipoTeste.AERODINAMICO;
        const resStr = await this.askQuestion('Resultado (1-APROVADO, 2-REPROVADO): ');
        const resultado = resStr === '1' ? ResultadoTeste.APROVADO : ResultadoTeste.REPROVADO;
        // CORREÇÃO APLICADA AQUI
        if (tipo) {
            aeronave.adicionarTeste(new Teste(tipo, resultado));
            console.log(`\nTeste ${tipo} adicionado com resultado ${resultado}.`);
        }
        else {
            console.log('Opção de teste inválida.');
        }
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async gerarRelatorio(aeronave) {
        console.log('\n--- Gerar Relatório Final ---');
        const nomeCliente = await this.askQuestion('Digite o nome do cliente para o relatório: ');
        this.relatorio.salvar(aeronave, nomeCliente);
        this.exibirSubMenuGerenciamento(aeronave);
    }
}
const app = new App();
app.start();
//# sourceMappingURL=index.js.map