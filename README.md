# Mapa Clientes Solar

Mapa interativo de clientes com calculadora de orçamento de visitas comerciais.

## Funcionalidades

- Mapa do Brasil com clientes por cidade (Leaflet / OpenStreetMap)
- Seleção de clientes para montar viagens
- Agrupamento automático por região (~300 km)
- Sugestão de hub/aeroporto mais próximo
- Orçamento: passagem, hotel, alimentação e deslocamento
- Exportação do orçamento em PDF

## Desenvolvimento local

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Deploy na Vercel

O projeto já está configurado para a Vercel (`vercel.json` + Vite).

### Opção 1 — Importar do GitHub (recomendado)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório `ilucasmacedo/mapa-clientes-solar`
3. Confirme as configurações (detectadas automaticamente):
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Clique em **Deploy**

Não é necessário configurar variáveis de ambiente.

### Opção 2 — CLI

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Stack

- React 19 + TypeScript
- Vite 8
- Leaflet / react-leaflet
- jsPDF (exportação PDF)
