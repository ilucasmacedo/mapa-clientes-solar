import { clientes } from '../src/data/clientes.ts'
import { exportarCarteiraXlsx } from '../src/utils/exportarCarteira.ts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const destino = path.join(__dirname, '../data/carteira-completa.xlsx')

exportarCarteiraXlsx(clientes, destino)
console.log(`Planilha gerada: ${destino} (${clientes.length} clientes)`)
