import { formatarMoeda } from '../utils/format'

interface FiltroFaixaValorProps {
  min: number
  max: number
  valorMin: number
  valorMax: number
  onChange: (valorMin: number, valorMax: number) => void
}

const PASSO = 100

export function FiltroFaixaValor({
  min,
  max,
  valorMin,
  valorMax,
  onChange,
}: FiltroFaixaValorProps) {
  const faixa = max - min || 1
  const pctMin = ((valorMin - min) / faixa) * 100
  const pctMax = ((valorMax - min) / faixa) * 100

  function atualizarMin(novoMin: number) {
    onChange(Math.min(novoMin, valorMax), valorMax)
  }

  function atualizarMax(novoMax: number) {
    onChange(valorMin, Math.max(novoMax, valorMin))
  }

  return (
    <div className="faixa-valor">
      <span className="faixa-valor-label">Faixa de valor</span>
      <div className="range-dual">
        <div
          className="range-dual-track"
          style={{
            left: `${pctMin}%`,
            right: `${100 - pctMax}%`,
          }}
        />
        <input
          type="range"
          className="range-dual-input range-dual-min"
          min={min}
          max={max}
          step={PASSO}
          value={valorMin}
          onChange={(e) => atualizarMin(Number(e.target.value))}
          aria-label="Valor mínimo"
        />
        <input
          type="range"
          className="range-dual-input range-dual-max"
          min={min}
          max={max}
          step={PASSO}
          value={valorMax}
          onChange={(e) => atualizarMax(Number(e.target.value))}
          aria-label="Valor máximo"
        />
      </div>
      <div className="faixa-valor-valores">
        <span>{formatarMoeda(valorMin)}</span>
        <span>{formatarMoeda(valorMax)}</span>
      </div>
    </div>
  )
}
