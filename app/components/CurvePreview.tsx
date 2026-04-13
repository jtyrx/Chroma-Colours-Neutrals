import {getCurveCenterModifier, getCurvePoints} from '@/app/lib/palette'

const VIEWBOX_WIDTH = 320
const VIEWBOX_HEIGHT = 180
const GRAPH_PADDING_X = 16
const GRAPH_PADDING_Y = 18

function mapPointToViewbox(x: number, y: number) {
  const usableWidth = VIEWBOX_WIDTH - GRAPH_PADDING_X * 2
  const usableHeight = VIEWBOX_HEIGHT - GRAPH_PADDING_Y * 2

  return {
    x: GRAPH_PADDING_X + x * usableWidth,
    y: GRAPH_PADDING_Y + (1 - y) * usableHeight,
  }
}

export function CurvePreview({adjustment}: {adjustment: number}) {
  const points = getCurvePoints(adjustment, 97)
  const centerModifier = getCurveCenterModifier(adjustment)
  const centerPoint = mapPointToViewbox(0.5, centerModifier)
  const path = points
    .map((point, index) => {
      const mapped = mapPointToViewbox(point.x, point.y)
      return `${index === 0 ? 'M' : 'L'} ${mapped.x} ${mapped.y}`
    })
    .join(' ')

  const horizontalGuides = [0, 0.5, 1]
  const verticalGuides = [0, 0.5, 1]

  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-white/50">
            Curve Preview
          </p>
          <p className="mt-1 text-sm leading-6 text-white/58">
            Symmetric parabola applied to chroma across the OKLCH L range (0–100).
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm text-white/88">p = {Math.round(adjustment)}</p>
          <p className="mt-1 font-mono text-xs text-white/58">
            center {Math.round(centerModifier * 100)}%
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[20px] border border-white/8 bg-black/30 p-3">
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="h-44 w-full"
          role="img"
          aria-label="Curve preview for the current chroma modifier"
        >
          {horizontalGuides.map((guide) => {
            const mapped = mapPointToViewbox(0, guide)
            return (
              <line
                key={`h-${guide}`}
                x1={GRAPH_PADDING_X}
                y1={mapped.y}
                x2={VIEWBOX_WIDTH - GRAPH_PADDING_X}
                y2={mapped.y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            )
          })}

          {verticalGuides.map((guide) => {
            const mapped = mapPointToViewbox(guide, 0)
            return (
              <line
                key={`v-${guide}`}
                x1={mapped.x}
                y1={GRAPH_PADDING_Y}
                x2={mapped.x}
                y2={VIEWBOX_HEIGHT - GRAPH_PADDING_Y}
                stroke={guide === 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}
                strokeDasharray={guide === 0.5 ? '4 6' : '0'}
                strokeWidth="1"
              />
            )
          })}

          <path d={path} fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="3" />
          <circle cx={centerPoint.x} cy={centerPoint.y} r="4" fill="white" />
        </svg>

        <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-white/48">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  )
}
