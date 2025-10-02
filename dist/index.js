import * as readline from 'readline';
import { Aeronave } from './models/Aeronave.js';
import { Peca } from './models/Peca.js';
import { Etapa } from './models/Etapa.js';
import { Funcionario } from './models/Funcionario.js';
import { Teste } from './models/Teste.js';
import { Relatorio } from './models/Relatorio.js';
import { TipoAeronave, TipoPeca, StatusEtapa, NivelPermissao, TipoTeste, ResultadoTeste, StatusPeca } from './models/enums.js';
import { DatabaseService } from './services/DatabaseService.js';
class App {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    aeronaves = [];
    funcionarios = [];
    relatorio = new Relatorio();
    usuarioLogado = null;
    dbService = new DatabaseService();
    askQuestion(query) {
        return new Promise(resolve => this.rl.question(query, resolve));
    }
    start() {
        const dadosCarregados = this.dbService.carregarDados();
        this.aeronaves = dadosCarregados.aeronaves;
        this.funcionarios = dadosCarregados.funcionarios;
        console.log('--- Bem-vindo ao Sistema AeroCode ---');
        this.exibirMenuLogin();
    }
    salvarEstado() {
        this.dbService.salvarDados(this.aeronaves, this.funcionarios);
    }
    // --- MENUS ---
    exibirMenuLogin() {
        console.log(`
        \n--- TELA INICIAL ---
        1. Login
        2. Registar novo utilizador
        9. Sair
        `);
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.fazerLogin();
                    break;
                case '2':
                    this.registarUtilizador();
                    break;
                case '9':
                    this.rl.close();
                    break;
                default:
                    console.log('Opção inválida!');
                    this.exibirMenuLogin();
                    break;
            }
        });
    }
    exibirMenuPrincipal() {
        console.log(`\nBem-vindo, ${this.usuarioLogado?.nome}! [${this.usuarioLogado?.nivelPermissao}]`);
        console.log(`
        --- MENU PRINCIPAL ---
        1. Cadastrar Aeronave
        2. Listar Aeronaves
        3. Gerenciar Aeronave Específica
        4. Listar Funcionários
        9. Logout
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
                    this.listarFuncionarios();
                    break;
                case '9':
                    this.usuarioLogado = null;
                    console.log('Logout efetuado com sucesso.');
                    this.exibirMenuLogin();
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
        8. Atualizar Status de Peça
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
                case '8':
                    this.atualizarStatusPeca(aeronave);
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
    // --- AUTENTICAÇÃO ---
    async fazerLogin() {
        console.log('\n--- Login ---');
        const email = await this.askQuestion('Email: ');
        const senha = await this.askQuestion('Senha: ');
        const funcionario = this.funcionarios.find(f => f.autenticar(email, senha));
        if (funcionario) {
            this.usuarioLogado = funcionario;
            console.log('\nLogin bem-sucedido!');
            this.exibirMenuPrincipal();
        }
        else {
            console.log('\nEmail ou senha incorretos.');
            this.exibirMenuLogin();
        }
    }
    async registarUtilizador() {
        console.log('\n--- Registo de Novo Utilizador ---');
        const nome = await this.askQuestion('Nome completo: ');
        const email = await this.askQuestion('Email (será o seu login): ');
        if (this.funcionarios.find(f => f.email === email)) {
            console.log('Erro: Este email já está em uso.');
            this.exibirMenuLogin();
            return;
        }
        const senha = await this.askQuestion('Senha: ');
        const telefone = await this.askQuestion('Telefone: ');
        const endereco = await this.askQuestion('Endereço: ');
        const permStr = await this.askQuestion('Nível de Permissão (1-Admin, 2-Engenheiro, 3-Operador): ');
        let permissao;
        if (permStr === '1')
            permissao = NivelPermissao.ADMINISTRADOR;
        else if (permStr === '2')
            permissao = NivelPermissao.ENGENHEIRO;
        else
            permissao = NivelPermissao.OPERADOR;
        const id = (this.funcionarios.length > 0) ? Math.max(...this.funcionarios.map(f => f.id)) + 1 : 1;
        const novoFunc = new Funcionario(id, nome, telefone, endereco, email, senha, permissao);
        this.funcionarios.push(novoFunc);
        this.salvarEstado();
        console.log(`\nUtilizador '${nome}' registado com sucesso! Por favor, faça o login.`);
        this.exibirMenuLogin();
    }
    // --- FUNÇÕES DO MENU PRINCIPAL ---
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
        const capacidade = parseInt(await this.askQuestion('Capacidade: '));
        const alcance = parseInt(await this.askQuestion('Alcance (km): '));
        if (isNaN(capacidade) || isNaN(alcance)) {
            console.log('Erro: Capacidade e Alcance devem ser números.');
        }
        else {
            this.aeronaves.push(new Aeronave(codigo, modelo, tipo, capacidade, alcance));
            this.salvarEstado();
            console.log(`\nAeronave '${modelo}' cadastrada com sucesso!`);
        }
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
        if (aeronave) {
            this.exibirSubMenuGerenciamento(aeronave);
        }
        else {
            console.log('Aeronave não encontrada.');
            this.exibirMenuPrincipal();
        }
    }
    // --- FUNÇÕES DO SUB-MENU DE GERENCIAMENTO ---
    async adicionarPeca(aeronave) {
        console.log('\n--- Adicionar Nova Peça ---');
        const nome = await this.askQuestion('Nome da peça: ');
        const tipoStr = await this.askQuestion('Tipo (1-NACIONAL, 2-IMPORTADA): ');
        const tipo = tipoStr === '1' ? TipoPeca.NACIONAL : TipoPeca.IMPORTADA;
        const fornecedor = await this.askQuestion('Fornecedor: ');
        aeronave.adicionarPeca(new Peca(nome, tipo, fornecedor));
        this.salvarEstado();
        console.log(`\nPeça '${nome}' adicionada com sucesso!`);
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async adicionarEtapa(aeronave) {
        console.log('\n--- Adicionar Etapa de Produção ---');
        const nome = await this.askQuestion('Nome da etapa: ');
        const prazoStr = await this.askQuestion('Prazo (AAAA-MM-DD): ');
        const prazo = new Date(prazoStr);
        if (isNaN(prazo.getTime())) {
            console.log('Erro: Data inválida.');
        }
        else {
            aeronave.adicionarEtapa(new Etapa(nome, prazo));
            this.salvarEstado();
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
        const index = parseInt(await this.askQuestion('\nNúmero da etapa: '));
        const etapa = aeronave.etapas[index];
        if (!etapa) {
            console.log('Índice inválido.');
            this.exibirSubMenuGerenciamento(aeronave);
            return;
        }
        const acao = await this.askQuestion(`Ação para '${etapa.nome}' (1-INICIAR, 2-FINALIZAR): `);
        if (acao === '1') {
            if (index > 0 && aeronave.etapas[index - 1]?.status !== StatusEtapa.CONCLUIDA) {
                console.log('Erro: A etapa anterior precisa ser concluída.');
            }
            else {
                etapa.iniciarEtapa();
                this.salvarEstado();
            }
        }
        else if (acao === '2') {
            etapa.finalizarEtapa();
            this.salvarEstado();
        }
        else {
            console.log('Ação inválida.');
        }
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async associarFuncionarioAEtapa(aeronave) {
        console.log('\n--- Associar Funcionário a Etapa ---');
        if (this.funcionarios.length === 0 || aeronave.etapas.length === 0) {
            console.log('É necessário ter funcionários e etapas.');
            this.exibirSubMenuGerenciamento(aeronave);
            return;
        }
        aeronave.etapas.forEach((e, i) => console.log(`${i}. ${e.nome}`));
        const etIndex = parseInt(await this.askQuestion('Número da etapa: '));
        console.log('');
        this.funcionarios.forEach(f => console.log(`ID: ${f.id} - ${f.nome}`));
        const funcId = parseInt(await this.askQuestion('ID do funcionário: '));
        const etapa = aeronave.etapas[etIndex];
        const funcionario = this.funcionarios.find(f => f.id === funcId);
        if (etapa && funcionario) {
            etapa.associarFuncionario(funcionario);
            this.salvarEstado();
        }
        else {
            console.log('Etapa ou funcionário não encontrado.');
        }
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async adicionarTeste(aeronave) {
        console.log('\n--- Adicionar Resultado de Teste ---');
        const tipoStr = await this.askQuestion('Tipo (1-ELETRICO, 2-HIDRAULICO, 3-AERODINAMICO): ');
        let tipo;
        if (tipoStr === '1')
            tipo = TipoTeste.ELETRICO;
        else if (tipoStr === '2')
            tipo = TipoTeste.HIDRAULICO;
        else if (tipoStr === '3')
            tipo = TipoTeste.AERODINAMICO;
        const resStr = await this.askQuestion('Resultado (1-APROVADO, 2-REPROVADO): ');
        const resultado = resStr === '1' ? ResultadoTeste.APROVADO : ResultadoTeste.REPROVADO;
        if (tipo) {
            aeronave.adicionarTeste(new Teste(tipo, resultado));
            this.salvarEstado();
            console.log(`\nTeste ${tipo} adicionado.`);
        }
        else {
            console.log('Opção inválida.');
        }
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async atualizarStatusPeca(aeronave) {
        console.log('\n--- Atualizar Status de Peça ---');
        if (aeronave.pecas.length === 0) {
            console.log('Nenhuma peça cadastrada.');
            this.exibirSubMenuGerenciamento(aeronave);
            return;
        }
        aeronave.pecas.forEach((p, i) => console.log(`${i}. ${p.nome} - Status: ${p.status}`));
        const index = parseInt(await this.askQuestion('\nNúmero da peça: '));
        const peca = aeronave.pecas[index];
        if (!peca) {
            console.log('Índice inválido.');
            this.exibirSubMenuGerenciamento(aeronave);
            return;
        }
        console.log('Qual o novo status? (1-Em Produção, 2-Em Transporte, 3-Pronta)');
        const statusStr = await this.askQuestion('Opção: ');
        let novoStatus;
        if (statusStr === '1')
            novoStatus = StatusPeca.EM_PRODUCAO;
        else if (statusStr === '2')
            novoStatus = StatusPeca.EM_TRANSPORTE;
        else if (statusStr === '3')
            novoStatus = StatusPeca.PRONTA;
        if (novoStatus) {
            peca.atualizarStatus(novoStatus);
            this.salvarEstado();
        }
        else {
            console.log('Opção inválida.');
        }
        this.exibirSubMenuGerenciamento(aeronave);
    }
    async gerarRelatorio(aeronave) {
        const nomeCliente = await this.askQuestion('Nome do cliente para o relatório: ');
        this.relatorio.salvar(aeronave, nomeCliente);
        this.exibirSubMenuGerenciamento(aeronave);
    }
}
const app = new App();
app.start();
//# sourceMappingURL=index.js.map