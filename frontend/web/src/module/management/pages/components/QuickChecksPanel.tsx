import { PlayCircle } from 'lucide-react'
import { getCheckStatusClass } from '../dashboardUtils'
import type { QuickChecksPanelProps } from '../dashboardTypes'

function QuickChecksPanel({
  checks,
  checkStates,
  onRunCheck,
  onRunAllChecks,
}: QuickChecksPanelProps) {
  return (
    <section className="mgmt-section">
      <div className="mgmt-section-title">
        <h3>Quick API Checks</h3>
        <p>Goi thu endpoint GET de kiem tra access theo token hien tai.</p>
      </div>

      <div className="mgmt-check-toolbar">
        <button type="button" className="mgmt-run-all-btn" onClick={onRunAllChecks}>
          <PlayCircle aria-hidden="true" />
          Run all checks
        </button>
      </div>

      <div className="mgmt-check-grid">
        {checks.map((item) => {
          const state = checkStates[item.id] ?? { status: 'idle', detail: 'Not executed' }
          return (
            <article className="mgmt-check-card" key={item.id}>
              <div className="mgmt-check-head">
                <strong>{item.label}</strong>
                <span className={getCheckStatusClass(state.status)}>{state.status}</span>
              </div>
              <code>{item.path}</code>
              <p>{state.detail}</p>
              <button type="button" onClick={() => onRunCheck(item)}>
                Run check
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default QuickChecksPanel
