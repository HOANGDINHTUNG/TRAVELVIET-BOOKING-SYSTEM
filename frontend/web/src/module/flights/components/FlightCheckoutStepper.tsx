import { Fragment } from 'react'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import './FlightCheckoutStepper.css'

export type FlightCheckoutStep = 1 | 2 | 3

const STEPS: Array<{ id: FlightCheckoutStep; label: string }> = [
  { id: 1, label: 'Nhập thông tin' },
  { id: 2, label: 'Thanh toán' },
  { id: 3, label: 'Hoàn tất' },
]

type FlightCheckoutStepperProps = {
  current: FlightCheckoutStep
}

export function FlightCheckoutStepper({ current }: FlightCheckoutStepperProps) {
  return (
    <nav className="fc-stepper" aria-label="Tiến trình đặt vé">
      <ol className="fc-stepper__list">
        {STEPS.map((step, index) => {
          const isActive = step.id === current
          const isComplete = step.id < current

          return (
            <Fragment key={step.id}>
              {index > 0 ? (
                <li className="fc-stepper__sep-wrap" aria-hidden>
                  <ChevronRight className="fc-stepper__sep" size={14} strokeWidth={2.5} />
                </li>
              ) : null}
              <li
                className={cn(
                  'fc-stepper__item',
                  isActive && 'is-active',
                  isComplete && 'is-complete',
                  !isActive && !isComplete && 'is-upcoming',
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="fc-stepper__dot">{step.id}</span>
                <span className="fc-stepper__label">{step.label}</span>
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
