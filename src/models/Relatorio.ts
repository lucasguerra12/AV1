import { Aeronave } from "./Aeronave.js";
import * as fs from 'fs';
export class Relatorio {
    private gerarConteudo(aeronave: Aeronave, nomeCliente: string): string {
        let conteudo = `--- Relatório Final de Aeronave ---\n\n`;
        conteudo += `Data de Entrega: ${new Date().toLocaleDateString()}\n`;
        conteudo += `Cliente: ${nomeCliente}\n\n`;
        conteudo += `AERONAVE\n`;
        conteudo += `Código: ${aeronave.codigo}\nModelo: ${aeronave.modelo}\nTipo: ${aeronave.tipo}\n\n`;
        conteudo += `PEÇAS UTILIZADAS\n`;
        aeronave.pecas.forEach(p => { conteudo += `- ${p.nome} (Fornecedor: ${p.fornecedor}) - Status: ${p.status}\n`; });
        conteudo += `\nETAPAS REALIZADAS\n`;
        aeronave.etapas.forEach(e => { conteudo += `- ${e.nome} (Prazo: ${e.prazo.toLocaleDateString()}) - Status: ${e.status}\n`; });
        conteudo += `\nRESULTADOS DOS TESTES\n`;
        aeronave.testes.forEach(t => { conteudo += `- Teste ${t.tipo}: ${t.resultado}\n`; });
        return conteudo;
    }
    public salvar(aeronave: Aeronave, nomeCliente: string): void {
        const conteudo = this.gerarConteudo(aeronave, nomeCliente);
        const nomeArquivo = `relatorio_${aeronave.codigo}.txt`;
        try {
            fs.writeFileSync(nomeArquivo, conteudo, 'utf-8');
            console.log(`\nRelatório salvo com sucesso no arquivo: ${nomeArquivo}`);
        } catch (error) {
            console.error("Erro ao salvar o relatório:", error);
        }
    }
}