# 💻 GUIA TÉCNICO DE IMPLEMENTAÇÃO
## Inteligência de Bazares - Exemplos de Código

---

## 📑 ÍNDICE

1. [Algoritmo de Pontuação](#1-algoritmo-de-pontuação)
2. [Deep Search Engine](#2-deep-search-engine)
3. [Machine Learning](#3-machine-learning)
4. [APIs e Integrações](#4-apis-e-integrações)
5. [Exemplos Frontend](#5-exemplos-frontend)

---

## 1. ALGORITMO DE PONTUAÇÃO

### 1.1 Função Principal

```javascript
// src/services/bazarIntelligence.js

class BazarIntelligenceService {
  
  /**
   * Calcula pontuação para uma data específica
   * @param {Date} data - Data a ser analisada
   * @param {Object} context - Contexto do usuário
   * @returns {Object} Resultado com pontuação e detalhes
   */
  async calcularPontuacao(data, context) {
    const resultado = {
      data: data,
      pontuacaoTotal: 0,
      detalhes: {},
      recomendacoes: [],
      alertas: []
    };
    
    // 1. Análise de Data Comercial (30%)
    const pontuacaoDataComercial = await this.analisarDataComercial(data);
    resultado.detalhes.dataComercial = pontuacaoDataComercial;
    resultado.pontuacaoTotal += pontuacaoDataComercial.pontos * 0.30;
    
    // 2. Análise de Sazonalidade (20%)
    const pontuacaoSazonalidade = await this.analisarSazonalidade(data);
    resultado.detalhes.sazonalidade = pontuacaoSazonalidade;
    resultado.pontuacaoTotal += pontuacaoSazonalidade.pontos * 0.20;
    
    // 3. Análise de Estoque (15%)
    const pontuacaoEstoque = await this.analisarEstoque(data, context.userId);
    resultado.detalhes.estoque = pontuacaoEstoque;
    resultado.pontuacaoTotal += pontuacaoEstoque.pontos * 0.15;
    
    // 4. Análise de Histórico (15%)
    const pontuacaoHistorico = await this.analisarHistorico(data, context.userId);
    resultado.detalhes.historico = pontuacaoHistorico;
    resultado.pontuacaoTotal += pontuacaoHistorico.pontos * 0.15;
    
    // 5. Tendências Web - Deep Search (10%)
    const pontuacaoTendencias = await this.analisarTendenciasWeb(data);
    resultado.detalhes.tendencias = pontuacaoTendencias;
    resultado.pontuacaoTotal += pontuacaoTendencias.pontos * 0.10;
    
    // 6. Análise de Competição (10%)
    const pontuacaoCompeticao = await this.analisarCompeticao(data);
    resultado.detalhes.competicao = pontuacaoCompeticao;
    resultado.pontuacaoTotal += pontuacaoCompeticao.pontos * 0.10;
    
    // Normalizar pontuação (0-100)
    resultado.pontuacaoTotal = Math.min(Math.round(resultado.pontuacaoTotal), 100);
    
    // Gerar recomendações com base na pontuação
    resultado.recomendacoes = this.gerarRecomendacoes(resultado);
    resultado.alertas = this.gerarAlertas(resultado);
    
    return resultado;
  }
  
  /**
   * Analisa se a data coincide com alguma data comercial importante
   */
  async analisarDataComercial(data) {
    const mes = data.getMonth() + 1;
    const dia = data.getDate();
    
    // Buscar datas comerciais no banco
    const datasComerciais = await db.datasComerciais.findMany({
      where: {
        OR: [
          { mes: mes, dataFixa: `${dia}/${mes}` },
          { mes: mes, dataFixa: null } // Datas móveis
        ]
      }
    });
    
    if (datasComerciais.length === 0) {
      return {
        pontos: 5,
        encontrada: false,
        motivo: "Não coincide com data comercial específica"
      };
    }
    
    // Pegar a data comercial de maior relevância
    const melhorData = datasComerciais.reduce((prev, current) => 
      (current.relevanciaTech > prev.relevanciaTech) ? current : prev
    );
    
    const pontos = melhorData.relevanciaTech * 3; // Max 30 pontos
    
    return {
      pontos: pontos,
      encontrada: true,
      nome: melhorData.nome,
      relevancia: melhorData.relevanciaTech,
      categoria: melhorData.categoria,
      motivo: `${melhorData.nome} - Relevância tech: ${melhorData.relevanciaTech}/10`
    };
  }
  
  /**
   * Analisa o índice de sazonalidade do mês
   */
  async analisarSazonalidade(data) {
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    
    // Buscar índice de sazonalidade
    const sazonalidade = await db.sazonalidadeMensal.findFirst({
      where: { mes: mes, ano: ano }
    });
    
    if (!sazonalidade) {
      // Usar média histórica se não tiver dados do ano
      const mediaHistorica = await db.sazonalidadeMensal.aggregate({
        where: { mes: mes },
        _avg: { indiceVendas: true }
      });
      
      return {
        pontos: 10,
        indice: mediaHistorica._avg.indiceVendas || 1.0,
        motivo: "Baseado em média histórica"
      };
    }
    
    // Converter índice para pontos (1.0 = 10pts, 1.20 = 20pts)
    const pontos = Math.min((sazonalidade.indiceVendas - 0.8) * 50, 20);
    
    let categoria;
    if (sazonalidade.indiceVendas >= 1.15) categoria = "EXCELENTE";
    else if (sazonalidade.indiceVendas >= 1.05) categoria = "MUITO BOM";
    else if (sazonalidade.indiceVendas >= 0.95) categoria = "BOM";
    else if (sazonalidade.indiceVendas >= 0.85) categoria = "REGULAR";
    else categoria = "RUIM";
    
    return {
      pontos: Math.max(pontos, 0),
      indice: sazonalidade.indiceVendas,
      categoria: categoria,
      motivo: `Índice de ${sazonalidade.indiceVendas} (${categoria})`
    };
  }
  
  /**
   * Analisa o estoque disponível do usuário
   */
  async analisarEstoque(data, userId) {
    // Buscar produtos em estoque
    const produtos = await db.produtos.findMany({
      where: {
        usuarioId: userId,
        status: { in: ['recebido', 'em_analise', 'publicado'] }
      }
    });
    
    const quantidade = produtos.length;
    const valorTotal = produtos.reduce((sum, p) => sum + (p.valorMercado || 0), 0);
    const categorias = [...new Set(produtos.map(p => p.categoria))];
    const produtosPremium = produtos.filter(p => p.valorMercado > 3000);
    
    // Calcular pontuação
    let pontos = 0;
    
    // Quantidade (max 5 pts)
    pontos += Math.min(quantidade * 0.4, 5);
    
    // Valor total (max 5 pts)
    pontos += Math.min(valorTotal / 5000, 5);
    
    // Diversidade (max 3 pts)
    pontos += Math.min(categorias.length * 0.75, 3);
    
    // Premium (max 2 pts)
    pontos += Math.min(produtosPremium.length * 0.5, 2);
    
    // Avaliar se estoque é adequado
    let avaliacao;
    if (quantidade >= 15) avaliacao = "EXCELENTE";
    else if (quantidade >= 10) avaliacao = "BOM";
    else if (quantidade >= 5) avaliacao = "REGULAR";
    else avaliacao = "BAIXO";
    
    return {
      pontos: Math.round(pontos),
      quantidade: quantidade,
      valorTotal: valorTotal,
      categorias: categorias.length,
      premium: produtosPremium.length,
      avaliacao: avaliacao,
      motivo: `${quantidade} produtos, R$ ${valorTotal.toFixed(2)} total`
    };
  }
  
  /**
   * Analisa histórico de vendas do usuário
   */
  async analisarHistorico(data, userId) {
    const mes = data.getMonth() + 1;
    
    // Buscar bazares realizados no mesmo mês em anos anteriores
    const bazaresAnteriores = await db.bazaresRealizados.findMany({
      where: {
        usuarioId: userId,
        dataInicio: {
          gte: new Date(data.getFullYear() - 2, mes - 1, 1),
          lt: new Date(data.getFullYear(), mes - 1, 1)
        }
      }
    });
    
    if (bazaresAnteriores.length === 0) {
      return {
        pontos: 7.5, // Pontuação neutra
        encontrado: false,
        motivo: "Sem histórico para este período"
      };
    }
    
    // Calcular médias
    const mediaVendas = bazaresAnteriores.reduce((sum, b) => 
      sum + b.produtosVendidos, 0) / bazaresAnteriores.length;
    const mediaFaturamento = bazaresAnteriores.reduce((sum, b) => 
      sum + b.faturamentoReal, 0) / bazaresAnteriores.length;
    const mediaConversao = bazaresAnteriores.reduce((sum, b) => 
      sum + b.taxaConversao, 0) / bazaresAnteriores.length;
    
    // Pontuação baseada em performance histórica
    let pontos = 0;
    
    // Taxa de conversão (max 7 pts)
    pontos += (mediaConversao / 100) * 7;
    
    // Faturamento (max 5 pts)
    pontos += Math.min(mediaFaturamento / 5000, 5);
    
    // Consistência (max 3 pts)
    pontos += Math.min(bazaresAnteriores.length * 1, 3);
    
    return {
      pontos: Math.round(pontos),
      encontrado: true,
      bazaresAnteriores: bazaresAnteriores.length,
      mediaVendas: Math.round(mediaVendas),
      mediaFaturamento: mediaFaturamento,
      mediaConversao: mediaConversao,
      motivo: `${bazaresAnteriores.length} bazares anteriores, ${mediaConversao.toFixed(0)}% conversão média`
    };
  }
  
  /**
   * Gera recomendações baseadas na análise
   */
  gerarRecomendacoes(resultado) {
    const recomendacoes = [];
    
    // Baseado na pontuação total
    if (resultado.pontuacaoTotal >= 90) {
      recomendacoes.push({
        tipo: 'positivo',
        mensagem: 'EXCELENTE data para bazar! Priorize esta data.',
        prioridade: 'alta'
      });
    } else if (resultado.pontuacaoTotal >= 70) {
      recomendacoes.push({
        tipo: 'positivo',
        mensagem: 'Boa data para bazar. Considere realizar.',
        prioridade: 'media'
      });
    } else if (resultado.pontuacaoTotal < 50) {
      recomendacoes.push({
        tipo: 'negativo',
        mensagem: 'Data com baixo potencial. Procure alternativas.',
        prioridade: 'alta'
      });
    }
    
    // Baseado no estoque
    if (resultado.detalhes.estoque.quantidade < 8) {
      recomendacoes.push({
        tipo: 'alerta',
        mensagem: `Estoque baixo (${resultado.detalhes.estoque.quantidade} produtos). Ideal: 12+`,
        prioridade: 'media'
      });
    }
    
    // Baseado em competição
    if (resultado.detalhes.competicao.nivel === 'ALTO') {
      recomendacoes.push({
        tipo: 'alerta',
        mensagem: 'Alta competição detectada. Considere antecipar ou adiar.',
        prioridade: 'media'
      });
    }
    
    return recomendacoes;
  }
}

module.exports = new BazarIntelligenceService();
```

---

## 2. DEEP SEARCH ENGINE

### 2.1 Serviço de Web Search

```javascript
// src/services/deepSearch.js

const axios = require('axios');
const cheerio = require('cheerio');

class DeepSearchService {
  
  constructor() {
    this.apiKey = process.env.SEARCH_API_KEY;
    this.cacheValidade = 7 * 24 * 60 * 60 * 1000; // 7 dias
  }
  
  /**
   * Realiza Deep Search sobre tendências de mercado
   */
  async buscarTendencias() {
    const queries = [
      'Black Friday tech Brasil 2025',
      'lançamentos smartphones Brasil',
      'tendências mercado eletrônicos',
      'eventos tecnologia Brasil',
      'sazonalidade vendas tech'
    ];
    
    const resultados = [];
    
    for (const query of queries) {
      // Verificar cache primeiro
      const cached = await this.verificarCache(query);
      if (cached && this.isCacheValido(cached)) {
        resultados.push(cached);
        continue;
      }
      
      // Fazer nova busca
      const resultado = await this.buscarWeb(query);
      
      // Salvar em cache
      await this.salvarCache(query, resultado);
      
      resultados.push(resultado);
      
      // Rate limiting
      await this.sleep(1000);
    }
    
    return resultados;
  }
  
  /**
   * Busca usando Google Custom Search API
   */
  async buscarWeb(query) {
    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: this.apiKey,
          cx: process.env.SEARCH_ENGINE_ID,
          q: query,
          dateRestrict: 'w1', // Última semana
          num: 10
        }
      });
      
      const items = response.data.items || [];
      
      // Processar resultados
      const processados = items.map(item => ({
        titulo: item.title,
        link: item.link,
        snippet: item.snippet,
        dataPublicacao: item.pagemap?.metatags?.[0]?.['article:published_time'],
        relevancia: this.calcularRelevancia(item, query)
      }));
      
      // Analisar sentimento e tendências
      const analise = await this.analisarResultados(processados, query);
      
      return {
        query: query,
        resultados: processados,
        analise: analise,
        timestamp: new Date()
      };
      
    } catch (error) {
      console.error('Erro ao buscar:', error);
      return {
        query: query,
        resultados: [],
        erro: error.message,
        timestamp: new Date()
      };
    }
  }
  
  /**
   * Analisa resultados para extrair insights
   */
  async analisarResultados(resultados, query) {
    const textoCompleto = resultados
      .map(r => r.snippet)
      .join(' ')
      .toLowerCase();
    
    // Detectar menções a produtos tech
    const produtos = {
      iphone: (textoCompleto.match(/iphone/gi) || []).length,
      samsung: (textoCompleto.match(/samsung|galaxy/gi) || []).length,
      xiaomi: (textoCompleto.match(/xiaomi/gi) || []).length,
      notebook: (textoCompleto.match(/notebook|laptop/gi) || []).length,
      fone: (textoCompleto.match(/fone|airpods|headphone/gi) || []).length
    };
    
    // Detectar palavras-chave de tendência
    const tendencias = {
      crescimento: (textoCompleto.match(/crescimento|aumento|alta/gi) || []).length,
      queda: (textoCompleto.match(/queda|redução|baixa/gi) || []).length,
      recordes: (textoCompleto.match(/recorde|máxima|pico/gi) || []).length
    };
    
    // Detectar eventos
    const eventos = this.detectarEventos(textoCompleto);
    
    return {
      produtosMaismencionados: this.ordenarPorValor(produtos),
      sentimentoGeral: tendencias.crescimento > tendencias.queda ? 'POSITIVO' : 'NEGATIVO',
      eventos: eventos,
      volumeResultados: resultados.length,
      relevanciaMedia: resultados.reduce((sum, r) => sum + r.relevancia, 0) / resultados.length
    };
  }
  
  /**
   * Detecta eventos em texto
   */
  detectarEventos(texto) {
    const eventos = [];
    
    // Padrões de eventos
    const padroes = [
      /black\s*friday/gi,
      /cyber\s*monday/gi,
      /dia\s*do\s*consumidor/gi,
      /prime\s*day/gi,
      /lançamento/gi
    ];
    
    padroes.forEach(padrao => {
      const matches = texto.match(padrao);
      if (matches && matches.length > 0) {
        eventos.push({
          tipo: matches[0],
          mencoes: matches.length
        });
      }
    });
    
    return eventos;
  }
  
  /**
   * Calcula relevância de um resultado
   */
  calcularRelevancia(item, query) {
    let score = 0;
    
    const queryTermos = query.toLowerCase().split(' ');
    const titulo = item.title.toLowerCase();
    const snippet = item.snippet.toLowerCase();
    
    // Termos no título valem mais
    queryTermos.forEach(termo => {
      if (titulo.includes(termo)) score += 3;
      if (snippet.includes(termo)) score += 1;
    });
    
    // Fontes confiáveis valem mais
    const fontesConfiveis = ['canaltech', 'tecmundo', 'valor', 'estadao', 'folha'];
    if (fontesConfiveis.some(fonte => item.link.includes(fonte))) {
      score += 5;
    }
    
    return Math.min(score, 10);
  }
  
  /**
   * Verificar cache
   */
  async verificarCache(query) {
    const cache = await db.tendenciasWeb.findFirst({
      where: { query: query },
      orderBy: { dataCaptura: 'desc' }
    });
    
    return cache;
  }
  
  /**
   * Verifica se cache ainda é válido
   */
  isCacheValido(cache) {
    const agora = new Date();
    const validoAte = new Date(cache.validoAte);
    return agora < validoAte;
  }
  
  /**
   * Salvar em cache
   */
  async salvarCache(query, resultado) {
    const validoAte = new Date(Date.now() + this.cacheValidade);
    
    await db.tendenciasWeb.create({
      data: {
        query: query,
        fonte: 'google_custom_search',
        tendenciaTipo: 'mercado',
        volumeBusca: resultado.resultados.length,
        variacaoPercentual: 0, // Calcular comparando com período anterior
        eventosDetectados: resultado.analise.eventos,
        dataCaptura: new Date(),
        validoAte: validoAte,
        relevancia: Math.round(resultado.analise.relevanciaMedia)
      }
    });
  }
  
  /**
   * Utilitário: sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Utilitário: ordenar objeto por valor
   */
  ordenarPorValor(obj) {
    return Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  }
}

module.exports = new DeepSearchService();
```

### 2.2 Cron Job para Atualização Automática

```javascript
// src/jobs/deepSearchCron.js

const cron = require('node-cron');
const deepSearchService = require('../services/deepSearch');
const bazarIntelligenceService = require('../services/bazarIntelligence');

/**
 * Agenda Deep Search para executar toda segunda às 06:00
 */
function iniciarCronJobs() {
  
  // Deep Search semanal (toda segunda às 06:00)
  cron.schedule('0 6 * * 1', async () => {
    console.log('🔍 Iniciando Deep Search semanal...');
    
    try {
      // Buscar tendências
      const tendencias = await deepSearchService.buscarTendencias();
      
      console.log(`✅ Deep Search concluído: ${tendencias.length} queries processadas`);
      
      // Recalcular recomendações de bazares para todos os usuários
      await recalcularBazares();
      
    } catch (error) {
      console.error('❌ Erro no Deep Search:', error);
    }
  });
  
  // Verificar alertas diariamente (todo dia às 09:00)
  cron.schedule('0 9 * * *', async () => {
    console.log('🔔 Verificando alertas inteligentes...');
    
    try {
      await verificarAlertas();
      console.log('✅ Alertas verificados');
    } catch (error) {
      console.error('❌ Erro ao verificar alertas:', error);
    }
  });
  
  console.log('⏰ Cron jobs iniciados');
}

/**
 * Recalcula recomendações de bazares para todos os usuários
 */
async function recalcularBazares() {
  const usuarios = await db.usuarios.findMany({
    where: { ativo: true }
  });
  
  for (const usuario of usuarios) {
    // Calcular próximos 90 dias
    const hoje = new Date();
    const proximos90Dias = [];
    
    for (let i = 0; i < 90; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() + i);
      proximos90Dias.push(data);
    }
    
    // Calcular pontuação para cada data
    for (const data of proximos90Dias) {
      const resultado = await bazarIntelligenceService.calcularPontuacao(data, {
        userId: usuario.id
      });
      
      // Salvar se pontuação for relevante (>60)
      if (resultado.pontuacaoTotal >= 60) {
        await salvarRecomendacao(usuario.id, resultado);
      }
    }
  }
}

/**
 * Salva recomendação de bazar no banco
 */
async function salvarRecomendacao(usuarioId, resultado) {
  // Verificar se já existe
  const existe = await db.inteligenciaBazares.findFirst({
    where: {
      usuarioId: usuarioId,
      dataSugerida: resultado.data
    }
  });
  
  if (existe) {
    // Atualizar
    await db.inteligenciaBazares.update({
      where: { id: existe.id },
      data: {
        pontuacaoTotal: resultado.pontuacaoTotal,
        pontuacaoDataComercial: resultado.detalhes.dataComercial?.pontos,
        pontuacaoSazonalidade: resultado.detalhes.sazonalidade?.pontos,
        pontuacaoEstoque: resultado.detalhes.estoque?.pontos,
        pontuacaoHistorico: resultado.detalhes.historico?.pontos,
        pontuacaoTendencias: resultado.detalhes.tendencias?.pontos,
        pontuacaoCompeticao: resultado.detalhes.competicao?.pontos,
        justificativa: JSON.stringify(resultado.detalhes),
        recomendacoes: JSON.stringify(resultado.recomendacoes),
        alertas: JSON.stringify(resultado.alertas),
        atualizadoEm: new Date()
      }
    });
  } else {
    // Criar novo
    await db.inteligenciaBazares.create({
      data: {
        usuarioId: usuarioId,
        dataSugerida: resultado.data,
        pontuacaoTotal: resultado.pontuacaoTotal,
        pontuacaoDataComercial: resultado.detalhes.dataComercial?.pontos,
        pontuacaoSazonalidade: resultado.detalhes.sazonalidade?.pontos,
        pontuacaoEstoque: resultado.detalhes.estoque?.pontos,
        pontuacaoHistorico: resultado.detalhes.historico?.pontos,
        pontuacaoTendencias: resultado.detalhes.tendencias?.pontos,
        pontuacaoCompeticao: resultado.detalhes.competicao?.pontos,
        produtosDisponiveis: resultado.detalhes.estoque?.quantidade,
        valorEstoqueTotal: resultado.detalhes.estoque?.valorTotal,
        justificativa: JSON.stringify(resultado.detalhes),
        recomendacoes: JSON.stringify(resultado.recomendacoes),
        alertas: JSON.stringify(resultado.alertas),
        status: 'sugerido'
      }
    });
  }
}

/**
 * Verifica e cria alertas inteligentes
 */
async function verificarAlertas() {
  // Implementar lógica de alertas
  // Ex: detectar oportunidades, competição, etc.
}

module.exports = { iniciarCronJobs };
```

---

## 3. MACHINE LEARNING

### 3.1 Modelo de Previsão de Vendas (Python)

```python
# ml-service/app.py (FastAPI)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os

app = FastAPI()

# Modelo global (carregado na inicialização)
modelo_vendas = None
scaler = None

class DadosTreinamento(BaseModel):
    historico_bazares: list
    
class PrevisaoRequest(BaseModel):
    data_bazar: str
    pontuacao_ia: int
    produtos_disponiveis: int
    valor_estoque: float
    mes: int

@app.on_event("startup")
async def startup_event():
    """Carrega ou cria modelo na inicialização"""
    global modelo_vendas, scaler
    
    # Tentar carregar modelo existente
    if os.path.exists('modelo_vendas.pkl'):
        modelo_vendas = joblib.load('modelo_vendas.pkl')
        scaler = joblib.load('scaler.pkl')
        print("✅ Modelo carregado")
    else:
        # Criar modelo novo
        modelo_vendas = LinearRegression()
        scaler = StandardScaler()
        print("⚠️ Modelo novo criado (precisa treinar)")

@app.post("/treinar")
async def treinar_modelo(dados: DadosTreinamento):
    """Treina o modelo com histórico de bazares"""
    global modelo_vendas, scaler
    
    if len(dados.historico_bazares) < 5:
        raise HTTPException(400, "Mínimo de 5 bazares para treinar")
    
    # Preparar features (X) e target (y)
    X = []
    y = []
    
    for bazar in dados.historico_bazares:
        features = [
            bazar['pontuacao_prevista'],
            bazar['produtos_previstos'],
            bazar['mes'],
            bazar.get('valor_estoque', 0),
            bazar.get('indice_sazonalidade', 1.0)
        ]
        X.append(features)
        y.append(bazar['produtos_vendidos'])
    
    X = np.array(X)
    y = np.array(y)
    
    # Normalizar features
    X_scaled = scaler.fit_transform(X)
    
    # Treinar modelo
    modelo_vendas.fit(X_scaled, y)
    
    # Calcular R²
    score = modelo_vendas.score(X_scaled, y)
    
    # Salvar modelo
    joblib.dump(modelo_vendas, 'modelo_vendas.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    
    return {
        "sucesso": True,
        "r2_score": score,
        "bazares_treinados": len(dados.historico_bazares),
        "mensagem": f"Modelo treinado com R² de {score:.2f}"
    }

@app.post("/prever")
async def prever_vendas(request: PrevisaoRequest):
    """Prevê número de vendas para um bazar"""
    global modelo_vendas, scaler
    
    if modelo_vendas is None:
        raise HTTPException(400, "Modelo não treinado ainda")
    
    # Preparar features
    features = np.array([[
        request.pontuacao_ia,
        request.produtos_disponiveis,
        request.mes,
        request.valor_estoque,
        obter_indice_sazonalidade(request.mes)
    ]])
    
    # Normalizar
    features_scaled = scaler.transform(features)
    
    # Fazer previsão
    predicao = modelo_vendas.predict(features_scaled)[0]
    
    # Calcular intervalo de confiança (±15%)
    margem = predicao * 0.15
    min_vendas = max(1, int(predicao - margem))
    max_vendas = int(predicao + margem)
    
    # Prever faturamento
    ticket_medio_estimado = request.valor_estoque / request.produtos_disponiveis if request.produtos_disponiveis > 0 else 1000
    faturamento_min = min_vendas * ticket_medio_estimado
    faturamento_max = max_vendas * ticket_medio_estimado
    
    return {
        "previsao_vendas": int(predicao),
        "intervalo_confianca": {
            "min": min_vendas,
            "max": max_vendas
        },
        "previsao_faturamento": {
            "min": round(faturamento_min, 2),
            "max": round(faturamento_max, 2)
        },
        "taxa_conversao_estimada": round((predicao / request.produtos_disponiveis) * 100, 1) if request.produtos_disponiveis > 0 else 0
    }

def obter_indice_sazonalidade(mes):
    """Retorna índice de sazonalidade para o mês"""
    indices = {
        1: 0.95, 2: 0.85, 3: 1.05, 4: 0.98,
        5: 1.08, 6: 1.02, 7: 1.00, 8: 1.05,
        9: 0.97, 10: 1.03, 11: 1.20, 12: 1.15
    }
    return indices.get(mes, 1.0)

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "modelo_treinado": modelo_vendas is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
```

### 3.2 Integração com Backend Node.js

```javascript
// src/services/mlService.js

const axios = require('axios');

class MLService {
  constructor() {
    this.mlApiUrl = process.env.ML_API_URL || 'http://localhost:8001';
  }
  
  /**
   * Treina modelo com histórico do usuário
   */
  async treinarModelo(userId) {
    // Buscar histórico de bazares
    const bazares = await db.bazaresRealizados.findMany({
      where: { usuarioId: userId },
      orderBy: { dataInicio: 'desc' }
    });
    
    if (bazares.length < 5) {
      throw new Error('Mínimo de 5 bazares necessários para treinar modelo');
    }
    
    // Preparar dados
    const historico = bazares.map(b => ({
      pontuacao_prevista: b.pontuacaoPrevista,
      produtos_previstos: b.produtosPrevistos,
      produtos_vendidos: b.produtosVendidos,
      faturamento_real: b.faturamentoReal,
      mes: new Date(b.dataInicio).getMonth() + 1,
      valor_estoque: b.produtosPrevistos * 1500, // Estimativa
      indice_sazonalidade: await this.obterIndiceSazonalidade(b.dataInicio)
    }));
    
    // Chamar API ML
    const response = await axios.post(`${this.mlApiUrl}/treinar`, {
      historico_bazares: historico
    });
    
    return response.data;
  }
  
  /**
   * Faz previsão de vendas
   */
  async preverVendas(data, pontuacaoIA, produtosDisponiveis, valorEstoque) {
    const mes = data.getMonth() + 1;
    
    try {
      const response = await axios.post(`${this.mlApiUrl}/prever`, {
        data_bazar: data.toISOString(),
        pontuacao_ia: pontuacaoIA,
        produtos_disponiveis: produtosDisponiveis,
        valor_estoque: valorEstoque,
        mes: mes
      });
      
      return response.data;
      
    } catch (error) {
      console.error('Erro ao prever vendas:', error.message);
      
      // Fallback: previsão simples
      const conversaoEstimada = pontuacaoIA / 100 * 0.85;
      const vendasEstimadas = Math.round(produtosDisponiveis * conversaoEstimada);
      
      return {
        previsao_vendas: vendasEstimadas,
        intervalo_confianca: {
          min: Math.round(vendasEstimadas * 0.8),
          max: Math.round(vendasEstimadas * 1.2)
        },
        fallback: true
      };
    }
  }
  
  async obterIndiceSazonalidade(data) {
    const mes = new Date(data).getMonth() + 1;
    const sazonalidade = await db.sazonalidadeMensal.findFirst({
      where: { mes: mes }
    });
    return sazonalidade?.indiceVendas || 1.0;
  }
}

module.exports = new MLService();
```

---

## 4. APIS E INTEGRAÇÕES

### 4.1 Endpoints da API Backend

```javascript
// src/routes/bazarIntelligence.routes.js

const express = require('express');
const router = express.Router();
const bazarService = require('../services/bazarIntelligence');
const authMiddleware = require('../middlewares/auth');

/**
 * GET /api/bazares/recomendacoes
 * Retorna recomendações de bazares para o usuário
 */
router.get('/recomendacoes', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const dias = parseInt(req.query.dias) || 90;
    
    // Buscar recomendações do banco (já calculadas pelo cron)
    const recomendacoes = await db.inteligenciaBazares.findMany({
      where: {
        usuarioId: userId,
        dataSugerida: {
          gte: new Date(),
          lte: new Date(Date.now() + dias * 24 * 60 * 60 * 1000)
        },
        status: 'sugerido'
      },
      orderBy: {
        pontuacaoTotal: 'desc'
      },
      take: 10
    });
    
    // Formatar resposta
    const formatadas = recomendacoes.map(r => ({
      id: r.id,
      data: r.dataSugerida,
      pontuacao: r.pontuacaoTotal,
      detalhes: {
        dataComercial: r.pontuacaoDataComercial,
        sazonalidade: r.pontuacaoSazonalidade,
        estoque: r.pontuacaoEstoque,
        historico: r.pontuacaoHistorico,
        tendencias: r.pontuacaoTendencias,
        competicao: r.pontuacaoCompeticao
      },
      previsao: {
        vendasMin: r.previsaoVendasMin,
        vendasMax: r.previsaoVendasMax,
        faturamentoMin: r.previsaoFaturamentoMin,
        faturamentoMax: r.previsaoFaturamentoMax
      },
      recomendacoes: JSON.parse(r.recomendacoes || '[]'),
      alertas: JSON.parse(r.alertas || '[]')
    }));
    
    res.json({
      sucesso: true,
      total: formatadas.length,
      recomendacoes: formatadas
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar recomendações'
    });
  }
});

/**
 * GET /api/bazares/analise/:data
 * Retorna análise detalhada de uma data específica
 */
router.get('/analise/:data', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = new Date(req.params.data);
    
    // Calcular análise completa
    const resultado = await bazarService.calcularPontuacao(data, { userId });
    
    res.json({
      sucesso: true,
      analise: resultado
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao analisar data'
    });
  }
});

/**
 * POST /api/bazares/agendar
 * Agenda um bazar para uma data
 */
router.post('/agendar', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { dataSugerida, recomendacaoId } = req.body;
    
    // Atualizar status da recomendação
    await db.inteligenciaBazares.update({
      where: { id: recomendacaoId },
      data: { status: 'agendado' }
    });
    
    // Criar alerta de lembrete
    const dataLembrete = new Date(dataSugerida);
    dataLembrete.setDate(dataLembrete.getDate() - 7); // 7 dias antes
    
    await db.alertasInteligentes.create({
      data: {
        usuarioId: userId,
        tipo: 'lembrete',
        titulo: 'Bazar agendado se aproxima',
        mensagem: `Seu bazar está marcado para ${new Date(dataSugerida).toLocaleDateString('pt-BR')}. Inicie divulgação!`,
        prioridade: 'alta',
        dataExpiracao: new Date(dataSugerida)
      }
    });
    
    res.json({
      sucesso: true,
      mensagem: 'Bazar agendado com sucesso'
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao agendar bazar'
    });
  }
});

/**
 * POST /api/bazares/registrar-resultado
 * Registra resultado de um bazar realizado
 */
router.post('/registrar-resultado', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      recomendacaoId,
      dataInicio,
      dataFim,
      produtosVendidos,
      faturamentoReal
    } = req.body;
    
    // Buscar recomendação
    const recomendacao = await db.inteligenciaBazares.findUnique({
      where: { id: recomendacaoId }
    });
    
    // Calcular métricas
    const taxaConversao = (produtosVendidos / recomendacao.produtosDisponiveis) * 100;
    const ticketMedio = faturamentoReal / produtosVendidos;
    const performance = (faturamentoReal / recomendacao.previsaoFaturamentoMin) * 100;
    
    // Salvar resultado
    const bazarRealizado = await db.bazaresRealizados.create({
      data: {
        usuarioId: userId,
        inteligenciaId: recomendacaoId,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        pontuacaoPrevista: recomendacao.pontuacaoTotal,
        produtosPrevistos: recomendacao.produtosDisponiveis,
        faturamentoPrevisto: recomendacao.previsaoFaturamentoMin,
        produtosVendidos: produtosVendidos,
        faturamentoReal: faturamentoReal,
        taxaConversao: taxaConversao,
        ticketMedio: ticketMedio,
        performanceVsPrevisao: performance
      }
    });
    
    // Atualizar status da recomendação
    await db.inteligenciaBazares.update({
      where: { id: recomendacaoId },
      data: { status: 'realizado' }
    });
    
    // Re-treinar modelo ML com novo dado
    try {
      const mlService = require('../services/mlService');
      await mlService.treinarModelo(userId);
    } catch (error) {
      console.error('Erro ao re-treinar modelo:', error);
    }
    
    res.json({
      sucesso: true,
      bazar: bazarRealizado,
      performance: {
        conversao: `${taxaConversao.toFixed(1)}%`,
        performanceVsPrevisao: `${performance.toFixed(1)}%`
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao registrar resultado'
    });
  }
});

module.exports = router;
```

---

## 5. EXEMPLOS FRONTEND

### 5.1 Componente React - Lista de Recomendações

```jsx
// src/components/BazarRecomendacoes.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function BazarRecomendacoes() {
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState(90);
  
  useEffect(() => {
    carregarRecomendacoes();
  }, [periodo]);
  
  const carregarRecomendacoes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bazares/recomendacoes?dias=${periodo}`);
      setRecomendacoes(response.data.recomendacoes);
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getPontuacaoColor = (pontuacao) => {
    if (pontuacao >= 90) return 'text-green-600';
    if (pontuacao >= 70) return 'text-blue-600';
    if (pontuacao >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getEstrelas = (pontuacao) => {
    const estrelas = Math.round(pontuacao / 20);
    return '⭐'.repeat(estrelas);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🧠 Inteligência de Bazares
        </h2>
        
        <select 
          value={periodo}
          onChange={(e) => setPeriodo(Number(e.target.value))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value={30}>Próximos 30 dias</option>
          <option value={90}>Próximos 90 dias</option>
          <option value={180}>Próximos 6 meses</option>
        </select>
      </div>
      
      {/* Lista de Recomendações */}
      <div className="space-y-4">
        {recomendacoes.map((rec) => (
          <RecomendacaoCard key={rec.id} recomendacao={rec} />
        ))}
        
        {recomendacoes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhuma recomendação encontrada para o período selecionado.
          </div>
        )}
      </div>
    </div>
  );
}

function RecomendacaoCard({ recomendacao }) {
  const [expandido, setExpandido] = useState(false);
  
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const pontuacaoColor = recomendacao.pontuacao >= 90 ? 'bg-green-50 border-green-200' :
                        recomendacao.pontuacao >= 70 ? 'bg-blue-50 border-blue-200' :
                        'bg-yellow-50 border-yellow-200';
  
  return (
    <div className={`border-2 rounded-lg p-6 ${pontuacaoColor} transition-all`}>
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <h3 className="text-lg font-bold">
              {formatarData(recomendacao.data)}
            </h3>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">
              {recomendacao.pontuacao}/100
            </span>
            <span className="text-xl">
              {getEstrelas(recomendacao.pontuacao)}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Faturamento previsto</div>
          <div className="font-bold text-lg">
            R$ {recomendacao.previsao.faturamentoMin.toLocaleString()} - 
            R$ {recomendacao.previsao.faturamentoMax.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Breakdown de Pontuação */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <PontuacaoItem 
          label="Data Comercial"
          valor={recomendacao.detalhes.dataComercial}
          max={30}
        />
        <PontuacaoItem 
          label="Sazonalidade"
          valor={recomendacao.detalhes.sazonalidade}
          max={20}
        />
        <PontuacaoItem 
          label="Estoque"
          valor={recomendacao.detalhes.estoque}
          max={15}
        />
        <PontuacaoItem 
          label="Histórico"
          valor={recomendacao.detalhes.historico}
          max={15}
        />
        <PontuacaoItem 
          label="Tendências"
          valor={recomendacao.detalhes.tendencias}
          max={10}
        />
        <PontuacaoItem 
          label="Competição"
          valor={recomendacao.detalhes.competicao}
          max={10}
        />
      </div>
      
      {/* Recomendações e Alertas */}
      {recomendacao.recomendacoes.length > 0 && (
        <div className="mb-4 space-y-2">
          {recomendacao.recomendacoes.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              {rec.tipo === 'positivo' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
               rec.tipo === 'alerta' ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
               <TrendingUp className="w-4 h-4 text-blue-600" />}
              <span>{rec.mensagem}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Botões */}
      <div className="flex gap-2">
        <button 
          onClick={() => setExpandido(!expandido)}
          className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition"
        >
          {expandido ? 'Ocultar' : 'Ver'} Análise Completa
        </button>
        
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Planejar Bazar
        </button>
      </div>
      
      {/* Análise Expandida */}
      {expandido && (
        <div className="mt-4 pt-4 border-t">
          {/* Conteúdo expandido aqui */}
          <p className="text-sm text-gray-600">
            Análise detalhada com cronograma sugerido, insights de competição, etc.
          </p>
        </div>
      )}
    </div>
  );
}

function PontuacaoItem({ label, valor, max }) {
  const percentual = (valor / max) * 100;
  
  return (
    <div className="bg-white rounded p-2">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <span className="text-xs font-bold">{valor}/{max}</span>
      </div>
    </div>
  );
}

function getEstrelas(pontuacao) {
  const estrelas = Math.round(pontuacao / 20);
  return '⭐'.repeat(estrelas);
}
```

---

Este guia técnico fornece a base de código necessária para implementar a funcionalidade de Inteligência de Bazares. Adapte conforme necessário para sua stack específica!
