import type { Cliente } from '../types'
import { regiaoDoEstado } from '../utils/regioes'

const clientesBrutos = [
  { empresa: 'LHT ENERGIA LTDA', cidade: 'Maceió', estado: 'AL', valor: 40641 },
  { empresa: 'CATARINNA S ENERGIA SOLAR LTDA', cidade: 'Joinville', estado: 'SC', valor: 16910 },
  { empresa: 'SOLLARIS ENGENHARIA COMERCIOS E SERVICOS ELETRICOS LTDA', cidade: 'Belém', estado: 'PA', valor: 7866 },
  { empresa: 'SANSOL ENERGIA FOTOVOLTAICA E TECNOLOGIA LTDA', cidade: 'Belém', estado: 'PA', valor: 11000 },
  { empresa: 'AZZON ENERGIA SOLAR LTDA', cidade: 'Araras', estado: 'SP', valor: 11400 },
  { empresa: 'Irium Solar (A IRIUM SOLAR LTDA)', cidade: 'Gurupi', estado: 'TO', valor: 10830 },
  { empresa: 'ELETROCLIMA COMERCIO E SERVICOS LTDA', cidade: 'Pedreiras', estado: 'MA', valor: 14000 },
  { empresa: 'D SOLARE ENERGIA E INOVACAO LTDA', cidade: 'Maceió', estado: 'AL', valor: 8550 },
  { empresa: 'ALVA ENGENHARIA LTDA', cidade: 'Praia Grande', estado: 'SP', valor: 8500 },
  { empresa: 'T8M ENERGIA DO BRASIL LTDA', cidade: 'Ipatinga', estado: 'MG', valor: 6000 },
  { empresa: 'ELLO REPRESENTACOES E NEGOCIOS LTDA', cidade: 'Itajaí', estado: 'SC', valor: 8717.77 },
  { empresa: 'MATRIZ SOLAR ENGENHARIA LTDA', cidade: 'São Mateus', estado: 'ES', valor: 8740 },
  { empresa: 'JISLAINE FARIAS DOS ANJOS BONINI', cidade: 'Cotriguaçu', estado: 'MT', valor: 5890 },
  { empresa: 'MHZ ENERGIA SOLAR LTDA', cidade: 'Goiânia', estado: 'GO', valor: 5700 },
  { empresa: 'L. H. SOUZA BORGES LTDA (Protons Engenharia)', cidade: 'Campo Grande', estado: 'MS', valor: 5000 },
  { empresa: 'R D S MOTA LTDA (Solit Energia Solar)', cidade: 'Rondonópolis', estado: 'MT', valor: 5130 },
  { empresa: 'MRT DISTRIBUICAO SOLAR LTDA', cidade: 'Ourinhos', estado: 'SP', valor: 6279.6 },
  { empresa: 'SOLARES - ENERGIA FOTOVOLTAICA LTDA', cidade: 'Presidente Prudente', estado: 'SP', valor: 8900 },
  { empresa: 'POTENCIAL SERVICO E COMERCIO DE MATERIAIS ELETRICOS LTDA', cidade: 'Manaus', estado: 'AM', valor: 4750 },
  { empresa: 'AGIL SOLAR FRANCHISING LTDA', cidade: 'Araçatuba', estado: 'SP', valor: 3332.03 },
  { empresa: 'VIASEG BRASIL - COMERCIO E SERVICOS LTDA', cidade: 'Rio de Janeiro', estado: 'RJ', valor: 4485.43 },
  { empresa: 'GD ENERGIA LTDA', cidade: 'Brasília', estado: 'DF', valor: 4370 },
  { empresa: 'ENELT MATERIAIS LTDA', cidade: 'Taió', estado: 'SC', valor: 3560.13 },
  { empresa: 'EFITEC SOLAR SOLUCOES EM ELETRICA LTDA', cidade: 'São Gonçalo', estado: 'RJ', valor: 2990.51 },
  { empresa: 'TECCEL ENERGIA SOLAR COMERCIO E SERVICOS LTDA', cidade: 'Cajazeiras', estado: 'PB', valor: 5130 },
  { empresa: 'PRIME SOL SOLUCAO EM ENERGIA LTDA', cidade: 'Campos dos Goytacazes', estado: 'RJ', valor: 3844.65 },
  { empresa: 'SELTEC SOLUCOES ELETRICAS E TECNOLOGICAS LTDA', cidade: 'Teófilo Otoni', estado: 'MG', valor: 5130 },
  { empresa: 'MGF ENGENHARIA E ENERGIA SOLAR LTDA', cidade: 'Canoas', estado: 'RS', valor: 3900.57 },
  { empresa: 'CONSTRUTORA MESQUITA DANTAS LTDA', cidade: 'Aparecida de Goiânia', estado: 'GO', valor: 2563.29 },
]

const coordenadas: Record<string, [number, number]> = {
  'Maceió-AL': [-9.6658, -35.735],
  'Joinville-SC': [-26.3044, -48.8456],
  'Belém-PA': [-1.4558, -48.4902],
  'Araras-SP': [-22.3572, -47.3842],
  'Gurupi-TO': [-11.7292, -49.0686],
  'Pedreiras-MA': [-4.5753, -44.6072],
  'Praia Grande-SP': [-24.0058, -46.4028],
  'Ipatinga-MG': [-19.4683, -42.5367],
  'Itajaí-SC': [-26.9078, -48.6619],
  'São Mateus-ES': [-18.7161, -39.8589],
  'Cotriguaçu-MT': [-9.8572, -58.2408],
  'Goiânia-GO': [-16.6869, -49.2648],
  'Campo Grande-MS': [-20.4697, -54.6201],
  'Rondonópolis-MT': [-16.4708, -54.6356],
  'Ourinhos-SP': [-22.9789, -49.8706],
  'Presidente Prudente-SP': [-22.1256, -51.3889],
  'Manaus-AM': [-3.119, -60.0217],
  'Araçatuba-SP': [-21.2089, -50.4328],
  'Rio de Janeiro-RJ': [-22.9068, -43.1729],
  'Brasília-DF': [-15.7942, -47.8822],
  'Taió-SC': [-27.1164, -50.1375],
  'São Gonçalo-RJ': [-22.8269, -43.0539],
  'Cajazeiras-PB': [-6.8883, -38.5583],
  'Campos dos Goytacazes-RJ': [-21.7642, -41.3192],
  'Teófilo Otoni-MG': [-17.8575, -41.5053],
  'Canoas-RS': [-29.9178, -51.1836],
  'Aparecida de Goiânia-GO': [-16.8198, -49.2469],
}

export const clientes: Cliente[] = clientesBrutos.map((item, index) => {
  const chave = `${item.cidade}-${item.estado}`
  const [lat, lng] = coordenadas[chave] ?? [-14.235, -51.9253]

  return {
    id: `cliente-${index + 1}`,
    empresa: item.empresa,
    cidade: item.cidade,
    estado: item.estado,
    regiao: regiaoDoEstado(item.estado),
    valor: item.valor,
    lat,
    lng,
  }
})
