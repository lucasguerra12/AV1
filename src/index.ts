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
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    private aeronaves: Aeronave[] = [];
    private funcionarios: Funcionario[] = [];
    private relatorio = new Relatorio();
    private usuarioLogado: Funcionario | null = null;
    private dbService = new DatabaseService();

    private askQuestion(query: string): Promise<string> {
        return new Promise(resolve => this.rl.question(query, resolve));
    }

    // --- LÓGICA DE INICIALIZAÇÃO ---
    public async start() {
        const dadosCarregados = this.dbService.carregarDados();
        this.aeronaves = dadosCarregados.aeronaves;
        this.funcionarios = dadosCarregados.funcionarios;
        console.log('--- Bem-vindo ao Sistema AeroCode ---');
        await this.mainLoop();
    }

    private salvarEstado() {
        this.dbService.salvarDados(this.aeronaves, this.funcionarios);
    }

    // --- LOOP PRINCIPAL DA APLICAÇÃO ---
    private async mainLoop() {
        while (true) {
            try {
                if (!this.usuarioLogado) {
                    const saiu = await this.exibirMenuLogin();
                    if (saiu) break;
                } else {
                    const nivel = this.usuarioLogado.nivelPermissao;
                    if (nivel === NivelPermissao.ADMINISTRADOR) {
                        const logout = await this.exibirMenuAdministrador();
                        if (logout) this.usuarioLogado = null;
                    } else if (nivel === NivelPermissao.ENGENHEIRO) {
                        const logout = await this.exibirMenuEngenheiro();
                        if (logout) this.usuarioLogado = null;
                    } else if (nivel === NivelPermissao.OPERADOR) {
                        const logout = await this.exibirMenuOperador();
                        if (logout) this.usuarioLogado = null;
                    }
                }
            } catch (error) {
                console.error("Ocorreu um erro:", error);
            }
        }
        this.rl.close();
        console.log("Sistema encerrado.");
    }
    
    // --- MENUS COM CONTROLE DE ACESSO ---

    private async exibirMenuLogin(): Promise<boolean> {
        console.log(`\n--- TELA INICIAL ---\n1. Login\n2. Registar novo utilizador\n9. Sair`);
        const opcao = await this.askQuestion('Escolha uma opção: ');
        switch (opcao) {
            case '1': await this.fazerLogin(); break;
            case '2': await this.registarUtilizador(); break;
            case '9': return true; 
            default: console.log('Opção inválida!'); break;
        }
        return false; 
    }
    
    // ADMINISTRADOR: Acesso Total
    private async exibirMenuAdministrador(): Promise<boolean> {
        console.log(`\nBem-vindo, ${this.usuarioLogado?.nome}! [${this.usuarioLogado?.nivelPermissao}]`);
        console.log(`--- MENU ADMINISTRADOR ---\n1. Cadastrar Aeronave\n2. Listar Aeronaves\n3. Gerenciar Aeronave\n4. Cadastrar Funcionário\n5. Listar Funcionários\n9. Logout`);
        const opcao = await this.askQuestion('Escolha uma opção: ');
        switch (opcao) {
            case '1': await this.cadastrarAeronave(); break;
            case '2': this.listarAeronaves(); break;
            case '3': await this.selecionarAeronave(); break;
            case '4': await this.registarUtilizador(true); break;
            case '5': this.listarFuncionarios(); break;
            case '9': return true; 
            default: console.log('Opção inválida!'); break;
        }
        return false;
    }

    // ENGENHEIRO: Acesso a operações da aeronave
    private async exibirMenuEngenheiro(): Promise<boolean> {
        console.log(`\nBem-vindo, ${this.usuarioLogado?.nome}! [${this.usuarioLogado?.nivelPermissao}]`);
        console.log(`--- MENU ENGENHEIRO ---\n1. Cadastrar Aeronave\n2. Listar Aeronaves\n3. Gerenciar Aeronave\n9. Logout`);
        const opcao = await this.askQuestion('Escolha uma opção: ');
        switch (opcao) {
            case '1': await this.cadastrarAeronave(); break;
            case '2': this.listarAeronaves(); break;
            case '3': await this.selecionarAeronave(); break;
            case '9': return true; 
            default: console.log('Opção inválida!'); break;
        }
        return false;
    }

    // OPERADOR: Acesso limitado a atualização de status
    private async exibirMenuOperador(): Promise<boolean> {
        console.log(`\nBem-vindo, ${this.usuarioLogado?.nome}! [${this.usuarioLogado?.nivelPermissao}]`);
        console.log(`--- MENU OPERADOR ---\n1. Listar Aeronaves\n2. Gerenciar Aeronave (Acesso Limitado)\n9. Logout`);
        const opcao = await this.askQuestion('Escolha uma opção: ');
        switch (opcao) {
            case '1': this.listarAeronaves(); break;
            case '2': await this.selecionarAeronave(); break;
            case '9': return true; 
            default: console.log('Opção inválida!'); break;
        }
        return false;
    }
    
    private async exibirSubMenuGerenciamento(aeronave: Aeronave): Promise<void> {
        const nivel = this.usuarioLogado?.nivelPermissao;

        while (true) {
            console.log(`\n--- Gerenciando Aeronave: ${aeronave.modelo} (${aeronave.codigo}) ---`);
            console.log(`1. Ver Detalhes Completos`);
            if (nivel !== NivelPermissao.OPERADOR) {
                console.log(`2. Adicionar Peça`);
                console.log(`3. Adicionar Etapa de Produção`);
                console.log(`5. Associar Funcionário a uma Etapa`);
                console.log(`6. Adicionar Teste à Aeronave`);
                console.log(`7. Gerar Relatório Final`);
            }
            console.log(`4. Gerenciar Andamento das Etapas`);
            console.log(`8. Atualizar Status de Peça`);
            console.log(`9. Voltar`);
            
            const opcao = await this.askQuestion('Escolha uma ação: ');
            
            if (opcao === '9') break;

            switch (opcao) {
                case '1': aeronave.detalhes(); break;
                case '2': if (nivel !== NivelPermissao.OPERADOR) await this.adicionarPeca(aeronave); else console.log("Acesso negado."); break;
                case '3': if (nivel !== NivelPermissao.OPERADOR) await this.adicionarEtapa(aeronave); else console.log("Acesso negado."); break;
                case '4': await this.gerenciarEtapas(aeronave); break;
                case '5': if (nivel !== NivelPermissao.OPERADOR) await this.associarFuncionarioAEtapa(aeronave); else console.log("Acesso negado."); break;
                case '6': if (nivel !== NivelPermissao.OPERADOR) await this.adicionarTeste(aeronave); else console.log("Acesso negado."); break;
                case '7': if (nivel !== NivelPermissao.OPERADOR) await this.gerarRelatorio(aeronave); else console.log("Acesso negado."); break;
                case '8': await this.atualizarStatusPeca(aeronave); break;
                default: console.log('Opção inválida!'); break;
            }
        }
    }


    // --- LÓGICA DE AUTENTICAÇÃO CORRIGIDA ---
    private async fazerLogin() {
        console.log('\n--- Login ---');
        const email = await this.askQuestion('Email: ');
        const senha = await this.askQuestion('Senha: ');
    
        // 1. Acha o funcionário pelo email. 2. Valida a senha
        const funcionario = this.funcionarios.find(f => f.email === email);
    
        if (funcionario && funcionario.autenticar(senha)) {
            this.usuarioLogado = funcionario;
            console.log('\nLogin bem-sucedido!');
        } else {
            console.log('\nEmail ou senha incorretos.');
        }
    }

    private async registarUtilizador(isAdmin: boolean = false) {
        console.log('\n--- Registo de Novo Utilizador ---');
        const nome = await this.askQuestion('Nome completo: ');
        const email = await this.askQuestion('Email (será o seu login): ');
        if (this.funcionarios.find(f => f.email === email)) {
            console.log('Erro: Este email já está em uso.');
            return;
        }
        const senha = await this.askQuestion('Senha: ');
        const telefone = await this.askQuestion('Telefone: ');
        const endereco = await this.askQuestion('Endereço: ');

        let permissao = NivelPermissao.OPERADOR; // Padrão
        if (isAdmin) {
            const permStr = await this.askQuestion('Nível de Permissão (1-Admin, 2-Engenheiro, 3-Operador): ');
            if (permStr === '1') permissao = NivelPermissao.ADMINISTRADOR;
            else if (permStr === '2') permissao = NivelPermissao.ENGENHEIRO;
        }

        const id = (this.funcionarios.length > 0) ? Math.max(...this.funcionarios.map(f => f.id)) + 1 : 1;
        const novoFunc = new Funcionario(id, nome, telefone, endereco, email, senha, permissao);
        this.funcionarios.push(novoFunc);
        this.salvarEstado();
        console.log(`\nUtilizador '${nome}' registado com sucesso!`);
    }


    // --- FUNÇÕES DE NEGÓCIO ---
    private async cadastrarAeronave() {
        console.log('\n--- Cadastro de Nova Aeronave ---');
        const codigo = await this.askQuestion('Código: ');
        if (this.aeronaves.find(a => a.codigo === codigo)) {
            console.log('Erro: Já existe uma aeronave com este código.');
            return;
        }
        const modelo = await this.askQuestion('Modelo: ');
        const tipoStr = await this.askQuestion('Tipo (1-COMERCIAL, 2-MILITAR): ');
        const tipo = tipoStr === '1' ? TipoAeronave.COMERCIAL : TipoAeronave.MILITAR;
        const capacidade = parseInt(await this.askQuestion('Capacidade: '));
        const alcance = parseInt(await this.askQuestion('Alcance (km): '));

        if (isNaN(capacidade) || isNaN(alcance)) {
            console.log('Erro: Capacidade e Alcance devem ser números.');
        } else {
            this.aeronaves.push(new Aeronave(codigo, modelo, tipo, capacidade, alcance));
            this.salvarEstado();
            console.log(`\nAeronave '${modelo}' cadastrada com sucesso!`);
        }
    }

    private listarAeronaves() {
        console.log('\n--- Aeronaves Cadastradas ---');
        if (this.aeronaves.length === 0) console.log('Nenhuma aeronave cadastrada.');
        else this.aeronaves.forEach(a => console.log(`- Código: ${a.codigo}, Modelo: ${a.modelo}`));
    }
    
    private listarFuncionarios() {
        console.log('\n--- Funcionários Cadastrados ---');
        if (this.funcionarios.length === 0) console.log('Nenhum funcionário cadastrado.');
        else this.funcionarios.forEach(f => console.log(`- ID: ${f.id}, Nome: ${f.nome}, Nível: ${f.nivelPermissao}`));
    }

    private async selecionarAeronave() {
        const codigo = await this.askQuestion('Digite o código da aeronave que deseja gerenciar: ');
        const aeronave = this.aeronaves.find(a => a.codigo === codigo);
        if (aeronave) {
            await this.exibirSubMenuGerenciamento(aeronave);
        } else {
            console.log('Aeronave não encontrada.');
        }
    }

    private async adicionarPeca(aeronave: Aeronave) {
        console.log('\n--- Adicionar Nova Peça ---');
        const nome = await this.askQuestion('Nome da peça: ');
        const tipoStr = await this.askQuestion('Tipo (1-NACIONAL, 2-IMPORTADA): ');
        const tipo = tipoStr === '1' ? TipoPeca.NACIONAL : TipoPeca.IMPORTADA;
        const fornecedor = await this.askQuestion('Fornecedor: ');
        aeronave.adicionarPeca(new Peca(nome, tipo, fornecedor));
        this.salvarEstado();
        console.log(`\nPeça '${nome}' adicionada com sucesso!`);
    }

    private async adicionarEtapa(aeronave: Aeronave) {
        console.log('\n--- Adicionar Etapa de Produção ---');
        const nome = await this.askQuestion('Nome da etapa: ');
        const prazoStr = await this.askQuestion('Prazo (AAAA-MM-DD): ');
        const prazo = new Date(prazoStr);
        if (isNaN(prazo.getTime())) {
            console.log('Erro: Data inválida.');
        } else {
            aeronave.adicionarEtapa(new Etapa(nome, prazo));
            this.salvarEstado();
            console.log(`\nEtapa '${nome}' adicionada!`);
        }
    }

    private async gerenciarEtapas(aeronave: Aeronave) {
        console.log('\n--- Gerenciar Andamento de Etapa ---');
        if (aeronave.etapas.length === 0) {
            console.log('Nenhuma etapa cadastrada.');
            return;
        }
        aeronave.etapas.forEach((e, i) => console.log(`${i}. ${e.nome} - Status: ${e.status}`));
        const index = parseInt(await this.askQuestion('\nNúmero da etapa: '));
        const etapa = aeronave.etapas[index];
        if (!etapa) {
            console.log('Índice inválido.');
            return;
        }
        const acao = await this.askQuestion(`Ação para '${etapa.nome}' (1-INICIAR, 2-FINALIZAR): `);
        if (acao === '1') {
            if (index > 0 && aeronave.etapas[index - 1]?.status !== StatusEtapa.CONCLUIDA) {
                console.log('Erro: A etapa anterior precisa ser concluída.');
            } else {
                etapa.iniciarEtapa();
                this.salvarEstado();
            }
        } else if (acao === '2') {
            etapa.finalizarEtapa();
            this.salvarEstado();
        } else {
            console.log('Ação inválida.');
        }
    }

    private async associarFuncionarioAEtapa(aeronave: Aeronave) {
        console.log('\n--- Associar Funcionário a Etapa ---');
        if (this.funcionarios.length === 0 || aeronave.etapas.length === 0) {
            console.log('É necessário ter funcionários e etapas.');
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
        } else {
            console.log('Etapa ou funcionário não encontrado.');
        }
    }

    private async adicionarTeste(aeronave: Aeronave) {
        console.log('\n--- Adicionar Resultado de Teste ---');
        const tipoStr = await this.askQuestion('Tipo (1-ELETRICO, 2-HIDRAULICO, 3-AERODINAMICO): ');
        let tipo: TipoTeste | undefined;
        if (tipoStr === '1') tipo = TipoTeste.ELETRICO;
        else if (tipoStr === '2') tipo = TipoTeste.HIDRAULICO;
        else if (tipoStr === '3') tipo = TipoTeste.AERODINAMICO;
        const resStr = await this.askQuestion('Resultado (1-APROVADO, 2-REPROVADO): ');
        const resultado = resStr === '1' ? ResultadoTeste.APROVADO : ResultadoTeste.REPROVADO;
        if (tipo) {
            aeronave.adicionarTeste(new Teste(tipo, resultado));
            this.salvarEstado();
            console.log(`\nTeste ${tipo} adicionado.`);
        } else {
            console.log('Opção inválida.');
        }
    }

    private async atualizarStatusPeca(aeronave: Aeronave) {
        console.log('\n--- Atualizar Status de Peça ---');
        if (aeronave.pecas.length === 0) {
            console.log('Nenhuma peça cadastrada.');
            return;
        }
        aeronave.pecas.forEach((p, i) => console.log(`${i}. ${p.nome} - Status: ${p.status}`));
        const index = parseInt(await this.askQuestion('\nNúmero da peça: '));
        const peca = aeronave.pecas[index];
        if (!peca) {
            console.log('Índice inválido.');
            return;
        }
        console.log('Qual o novo status? (1-Em Produção, 2-Em Transporte, 3-Pronta)');
        const statusStr = await this.askQuestion('Opção: ');
        let novoStatus: StatusPeca | undefined;
        if (statusStr === '1') novoStatus = StatusPeca.EM_PRODUCAO;
        else if (statusStr === '2') novoStatus = StatusPeca.EM_TRANSPORTE;
        else if (statusStr === '3') novoStatus = StatusPeca.PRONTA;
        if (novoStatus) {
            peca.atualizarStatus(novoStatus);
            this.salvarEstado();
        } else {
            console.log('Opção inválida.');
        }
    }

    private async gerarRelatorio(aeronave: Aeronave) {
        const nomeCliente = await this.askQuestion('Nome do cliente para o relatório: ');
        this.relatorio.salvar(aeronave, nomeCliente);
    }
}
const app = new App();
app.start();