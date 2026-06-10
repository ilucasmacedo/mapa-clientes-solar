import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const empresasPath =
  process.argv[2] ?? path.join(__dirname, '../data/empresas-cnpj-cidades.csv')
const valoresPath =
  process.argv[3] ?? path.join(__dirname, '../data/clientes-valores.csv')

function parseCsvLine(line) {
  const parts = []
  let cur = ''
  let inQuotes = false
  for (let j = 0; j < line.length; j++) {
    const ch = line[j]
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (ch === ',' && !inQuotes) {
      parts.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  parts.push(cur)
  return parts
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/)
  return lines.slice(1).map(parseCsvLine).filter((p) => p.some((x) => x.trim()))
}

function normalizeCnpj(cnpj) {
  return cnpj.replace(/\D/g, '')
}

function parseValor(raw) {
  return Number(raw.replace(/[R$\s.]/g, '').replace(',', '.'))
}

function formatCidade(raw) {
  const upper = raw.trim().toUpperCase()
  const acentos = {
    'MACEIO': 'Maceió',
    'SAO PAULO': 'São Paulo',
    'GOIANIA': 'Goiânia',
    'BRASILIA': 'Brasília',
    'BELEM': 'Belém',
    'ITAJAI': 'Itajaí',
    'SAO MATEUS': 'São Mateus',
    'RONDONOPOLIS': 'Rondonópolis',
    'COTRIGUACU': 'Cotriguaçu',
    'TEOFILO OTONI': 'Teófilo Otoni',
    'APARECIDA DE GOIANIA': 'Aparecida de Goiânia',
    'SAO GONCALO': 'São Gonçalo',
    'SAO JOSE DO EGITO': 'São José do Egito',
    'JARAGUA DO SUL': 'Jaraguá do Sul',
    'CAMPOS DOS GOYTACAZES': 'Campos dos Goytacazes',
    'ARACATUBA': 'Araçatuba',
    'RIBEIRAO PRETO': 'Ribeirão Preto',
    'UBERLANDIA': 'Uberlândia',
    'FLORIANOPOLIS': 'Florianópolis',
    'CHAPECO': 'Chapecó',
    'MACAPA': 'Macapá',
    'PAROBE': 'Parobé',
    'JOAO PESSOA': 'João Pessoa',
    'CUIABA': 'Cuiabá',
    'MARINGA': 'Maringá',
    'CIDADE OCIDENTAL': 'Cidade Ocidental',
    'CASTANHAL': 'Castanhal',
    'ANANINDEUA': 'Ananindeua',
    'PARNAMIRIM': 'Parnamirim',
    'COLATINA': 'Colatina',
    'SORRISO': 'Sorriso',
    'BLUMENAU': 'Blumenau',
    'LONDRINA': 'Londrina',
    'CAMPINAS': 'Campinas',
    'CAJAZEIRAS': 'Cajazeiras',
    'CANOAS': 'Canoas',
    'PALMAS': 'Palmas',
    'NATAL': 'Natal',
    'RECIFE': 'Recife',
    'SALVADOR': 'Salvador',
    'MANAUS': 'Manaus',
    'CURITIBA': 'Curitiba',
    'FORTALEZA': 'Fortaleza',
    'TERESINA': 'Teresina',
    'JOINVILLE': 'Joinville',
    'ARARAS': 'Araras',
    'OURINHOS': 'Ourinhos',
    'IPATINGA': 'Ipatinga',
    'IMBUIA': 'Imbuia',
    'GURUPI': 'Gurupi',
    'RIO VERDE': 'Rio Verde',
    'VOTUPORANGA': 'Votuporanga',
    'PASSOS': 'Passos',
    'PETROLINA': 'Petrolina',
    'CAMPO GRANDE': 'Campo Grande',
    'TAIO': 'Taió',
    'SERRA': 'Serra',
    'PIEN': 'Pien',
    'ARACAJU': 'Aracaju',
    'BELO HORIZONTE': 'Belo Horizonte',
    'PORTO ALEGRE': 'Porto Alegre',
    'RIO DE JANEIRO': 'Rio de Janeiro',
    'SAO LUIS': 'São Luiz',
    'SAO LUIZ': 'São Luiz',
    'APARECIDA': 'Aparecida',
    'CAMAQUA': 'Camaquá',
    'GUARATUBA': 'Guaratuba',
    'ITABORAI': 'Itaboraí',
    'CABO FRIO': 'Cabo Frio',
    'RIO DO SUL': 'Rio do Sul',
    'XANXERE': 'Xanxerê',
    'DOIS VIZINHOS': 'Dois Vizinhos',
    'SENHOR DO BONFIM': 'Senhor do Bonfim',
    'RIBEIRA DO POMBAL': 'Ribeira do Pombal',
    'SANTANA DO IPANEMA': 'Santana do Ipanema',
    'NOVA CANAA DO NORTE': 'Nova Canaã do Norte',
    'ARAGUAINA': 'Araguaína',
    'JATAI': 'Jataí',
    'RUSSAS': 'Russas',
    'MOSSORO': 'Mossoró',
    'JUAZEIRO DO NORTE': 'Juazeiro do Norte',
    'FEIRA DE SANTANA': 'Feira de Santana',
    'PRESIDENTE PRUDENTE': 'Presidente Prudente',
    'PRAIA GRANDE': 'Praia Grande',
    'VITORIA DA CONQUISTA': 'Vitória da Conquista',
    'CAMAQUA': 'Camaquá',
  }
  if (acentos[upper]) return acentos[upper]
  return raw
    .trim()
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const coordenadas = {
  'Maceió-AL': [-9.6658, -35.735],
  'Joinville-SC': [-26.3044, -48.8456],
  'São Luiz-MA': [-2.5297, -44.3028],
  'Pedreiras-MA': [-4.5753, -44.6072],
  'Araras-SP': [-22.3572, -47.3842],
  'Belém-PA': [-1.4558, -48.4902],
  'Itajaí-SC': [-26.9078, -48.6619],
  'Gurupi-TO': [-11.7292, -49.0686],
  'Presidente Prudente-SP': [-22.1256, -51.3889],
  'Ipatinga-MG': [-19.4683, -42.5367],
  'Praia Grande-SP': [-24.0058, -46.4028],
  'São Mateus-ES': [-18.7161, -39.8589],
  'São José do Egito-PE': [-7.4694, -37.2744],
  'Imbuia-SC': [-27.4911, -49.4247],
  'Ourinhos-SP': [-22.9789, -49.8706],
  'Rondonópolis-MT': [-16.4708, -54.6356],
  'Rio Verde-GO': [-17.7975, -50.9261],
  'Cotriguaçu-MT': [-9.8572, -58.2408],
  'Goiânia-GO': [-16.6869, -49.2648],
  'Parobé-RS': [-29.6286, -50.8347],
  'Teófilo Otoni-MG': [-17.8575, -41.5053],
  'Cidade Ocidental-GO': [-16.0799, -47.9258],
  'Cajazeiras-PB': [-6.8883, -38.5583],
  'Aparecida-PB': [-6.7844, -38.0803],
  'Jaraguá do Sul-SC': [-26.4851, -49.0713],
  'Canoas-RS': [-29.9178, -51.1836],
  'Campos dos Goytacazes-RJ': [-21.7642, -41.3192],
  'Manaus-AM': [-3.119, -60.0217],
  'Taió-SC': [-27.1164, -50.1375],
  'Maringá-PR': [-23.4205, -51.9333],
  'Natal-RN': [-5.7945, -35.211],
  'Castanhal-PA': [-1.2936, -47.9267],
  'Serra-ES': [-20.1286, -40.3078],
  'Passos-MG': [-20.7192, -46.6097],
  'Macapá-AP': [0.0356, -51.0705],
  'Xanxerê-SC': [-26.8747, -52.4036],
  'Londrina-PR': [-23.3045, -51.1696],
  'Feira de Santana-BA': [-12.2664, -38.9663],
  'São Gonçalo-RJ': [-22.8269, -43.0539],
  'Chapecó-SC': [-27.1004, -52.6157],
  'Campinas-SP': [-22.9099, -47.0626],
  'Ananindeua-PA': [-1.3658, -48.3722],
  'Belo Horizonte-MG': [-19.9167, -43.9345],
  'Parnamirim-RN': [-5.915, -35.2628],
  'Dois Vizinhos-PR': [-25.7343, -53.0572],
  'Aparecida de Goiânia-GO': [-16.8198, -49.2469],
  'Itaboraí-RJ': [-22.7444, -42.8594],
  'Araçatuba-SP': [-21.2089, -50.4328],
  'Recife-PE': [-8.0476, -34.877],
  'Guaratuba-PR': [-25.8828, -48.5747],
  'Camaquá-RS': [-30.8511, -51.8122],
  'Petrolina-PE': [-9.3891, -40.5028],
  'Campo Grande-MS': [-20.4697, -54.6201],
  'Santana do Ipanema-AL': [-9.3783, -37.2453],
  'Pien-PR': [-25.4397, -49.6297],
  'Blumenau-SC': [-26.9194, -49.0661],
  'Palmas-TO': [-10.2491, -48.3243],
  'Salvador-BA': [-12.9714, -38.5014],
  'Jataí-GO': [-17.885, -51.7186],
  'Araguaína-TO': [-7.1911, -48.2072],
  'Ribeira do Pombal-BA': [-10.8344, -38.5358],
  'Votuporanga-SP': [-20.4236, -49.9786],
  'Senhor do Bonfim-BA': [-10.4614, -40.1894],
  'Nova Canaã do Norte-MT': [-10.5589, -55.1858],
  'Cabo Frio-RJ': [-22.8808, -42.0189],
  'Colatina-ES': [-19.5396, -40.6309],
  'Vitória da Conquista-BA': [-14.8615, -40.8442],
  'Sorriso-MT': [-12.5428, -55.7211],
  'Russas-CE': [-4.9403, -37.976],
  'Ribeirão Preto-SP': [-21.1775, -47.8103],
  'Campina Grande-PB': [-7.2306, -35.8811],
  'Rio do Sul-SC': [-27.2144, -49.6431],
  'Fortaleza-CE': [-3.7319, -38.5267],
  'Curitiba-PR': [-25.4284, -49.2733],
  'Teresina-PI': [-5.0892, -42.8019],
  'Cuiabá-MT': [-15.601, -56.0974],
  'São Paulo-SP': [-23.5505, -46.6333],
  'Brasília-DF': [-15.7942, -47.8822],
  'Florianópolis-SC': [-27.5954, -48.548],
  'Vitória-ES': [-20.3155, -40.3128],
  'Rio de Janeiro-RJ': [-22.9068, -43.1729],
  'João Pessoa-PB': [-7.1195, -34.845],
  'Porto Alegre-RS': [-30.0346, -51.2177],
  'Uberlândia-MG': [-18.9186, -48.2772],
  'Governador Valadares-MG': [-18.8545, -41.9494],
  'Mossoró-RN': [-5.1878, -37.344],
  'Juazeiro do Norte-CE': [-7.2306, -39.3136],
  'Imperatriz-MA': [-5.5185, -47.4917],
  'Montes Claros-MG': [-16.735, -43.8617],
  'Aracaju-SE': [-10.9472, -37.0731],
  'Cascavel-PR': [-24.9559, -53.4552],
  'Macapá-AP': [0.0356, -51.0705],
}

const regioes = {
  AC: 'Norte', AP: 'Norte', AM: 'Norte', PA: 'Norte', RO: 'Norte', RR: 'Norte', TO: 'Norte',
  AL: 'Nordeste', BA: 'Nordeste', CE: 'Nordeste', MA: 'Nordeste', PB: 'Nordeste', PE: 'Nordeste', PI: 'Nordeste', RN: 'Nordeste', SE: 'Nordeste',
  DF: 'Centro-Oeste', GO: 'Centro-Oeste', MT: 'Centro-Oeste', MS: 'Centro-Oeste',
  ES: 'Sudeste', MG: 'Sudeste', RJ: 'Sudeste', SP: 'Sudeste',
  PR: 'Sul', RS: 'Sul', SC: 'Sul',
}

const valoresCsv = parseCsv(fs.readFileSync(valoresPath, 'utf8'))
const valoresPorCnpj = new Map()
for (const row of valoresCsv) {
  const [empresa, cnpj, , , valorRaw] = row
  if (!cnpj || !valorRaw) continue
  valoresPorCnpj.set(normalizeCnpj(cnpj), {
    valor: parseValor(valorRaw),
    empresa: empresa.trim(),
  })
}

const empresasCsv = parseCsv(fs.readFileSync(empresasPath, 'utf8'))
const missingCoords = new Set()
const semValor = []

const clientes = empresasCsv.map((row, index) => {
  const [nomeOriginal, razaoSocial, cnpj, cidadeRaw, estadoRaw] = row
  const cnpjNorm = normalizeCnpj(cnpj)
  const valorInfo = valoresPorCnpj.get(cnpjNorm)
  if (!valorInfo) semValor.push(nomeOriginal?.trim())

  const cidade = formatCidade(cidadeRaw)
  const estado = estadoRaw.trim().toUpperCase()
  const chave = `${cidade}-${estado}`
  const coords = coordenadas[chave]
  if (!coords) missingCoords.add(chave)
  const [lat, lng] = coords ?? [-14.235, -51.9253]

  return {
    id: `cliente-${index + 1}`,
    empresa: nomeOriginal?.trim() ?? razaoSocial?.trim(),
    razaoSocial: razaoSocial?.trim(),
    cnpj: cnpjNorm,
    cidade,
    estado,
    regiao: regioes[estado] ?? 'Sudeste',
    valor: valorInfo?.valor ?? 0,
    lat,
    lng,
  }
})

if (missingCoords.size) {
  console.warn('Cidades sem coordenada:', [...missingCoords].join(', '))
}
if (semValor.length) {
  console.warn('Clientes sem valor no CSV anterior:', semValor.join(', '))
}

const out = `import type { Cliente } from '../types'

// Gerado a partir de data/empresas-cnpj-cidades.csv + data/clientes-valores.csv
// Rode: node scripts/gerar-clientes.mjs

export const clientes: Cliente[] = ${JSON.stringify(clientes, null, 2).replace(/"([^"]+)":/g, '$1:')}
`

fs.writeFileSync(path.join(__dirname, '../src/data/clientes.ts'), out)
console.log(`Gerados ${clientes.length} clientes em src/data/clientes.ts`)
