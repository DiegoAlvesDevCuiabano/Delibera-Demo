# Delibera. — Protótipo Interativo

> Gestão de solicitações acadêmicas para instituições de ensino.
> Sem papel, sem WhatsApp, sem e-mail perdido.

**[Acessar o protótipo ao vivo](https://diegoalvesdevcuiabano.github.io/Delibera-Demo/)**

---

## O que é o Delibera

O Delibera centraliza solicitações acadêmicas (segunda chamada, abono de falta, contestação de nota) em um painel único — com protocolo, histórico e decisão registrada. Substitui o fluxo fragmentado de WhatsApp, e-mail e papel por um sistema rastreável e em conformidade com a LGPD.

**Público-alvo:** Coordenações acadêmicas de faculdades e escolas técnicas.

---

## Telas do protótipo

| # | Tela | Descrição | Público |
|---|------|-----------|---------|
| 1 | [Landing Page](index.html) | Proposta de valor, antes/depois, funcionalidades | Visitante |
| 2 | [Login](login.html) | Acesso via Google/Outlook ou email+senha | Coordenação |
| 3 | [Dashboard](dashboard-coordenacao.html) | KPIs, gráfico por tipo, tabela de pendências | Coordenação |
| 4 | [Analisar Solicitação](analisar-solicitacao.html) | Revisar dados, anexos e decidir (deferir/encaminhar/negar) | Coordenação |
| 5 | [Nova Solicitação](nova-solicitacao.html) | Formulário guiado com stepper e upload | Aluno |
| 6 | [Confirmação](confirmacao-solicitacao.html) | Protocolo gerado + resumo da solicitação | Aluno |
| 7 | [Acompanhar](acompanhar.html) | Lista de solicitações com filtros e prazo estimado | Aluno |
| 8 | [Status da Solicitação](status-solicitacao.html) | Detalhe com timeline de eventos | Aluno |
| 9 | [Planos](planos.html) | Plano único com preço, piloto de 30 dias | Visitante |
| 10 | [Sobre](sobre.html) | Missão, valores e origem do projeto | Visitante |
| 11 | [Suporte](suporte.html) | Canais de contato, FAQ e formulário | Visitante |
| 12 | [Termos de Uso](termos.html) | Termos legais com TOC navegável | Visitante |
| 13 | [Privacidade](privacidade.html) | Política de privacidade (LGPD) | Visitante |

---

## Tour guiado

O protótipo inclui um **tour interativo** que guia o visitante pelo fluxo completo do produto.

1. Abra a [landing page](index.html)
2. Clique no botão **"Tour guiado"** (canto inferior direito)
3. Siga os balões laranjas — eles indicam onde clicar em cada tela

O tour percorre: Landing → Login → Dashboard → Analisar → Landing → Nova Solicitação → Confirmação → Acompanhar.

---

## Fluxos principais

### Fluxo do coordenador
```
Login → Dashboard (KPIs + pendências) → Analisar solicitação → Deferir / Encaminhar / Negar
```

### Fluxo do aluno
```
Nova Solicitação → Confirmação (protocolo) → Acompanhar (prazo estimado) → Status (timeline)
```

---

## Stack do protótipo

- HTML estático + CSS inline
- Bootstrap 5.3 + Bootstrap Icons
- Plus Jakarta Sans (Google Fonts)
- Chart.js (gráficos do dashboard)
- Zero dependência de backend — tudo roda no navegador

---

## Identidade visual

| Elemento | Valor |
|----------|-------|
| Ícone | 4 barras coloridas (laranja/azul/verde/navy) — narrativa de "canais virando protocolo" |
| Wordmark | *Delibera.* — Georgia serifada itálica com ponto laranja |
| Paleta | Navy `#1e3a5f` · Laranja `#f97316` · Azul `#3b82f6` · Verde `#10b981` |
| Tipografia | Plus Jakarta Sans (corpo) · Georgia (wordmark) |

---

## Status

Em fase de validação com coordenações parceiras. Piloto de 30 dias gratuito.

---

<p align="center">
  <strong>Delibera.</strong> — Feito em Cuiabá, MT
</p>
