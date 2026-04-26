import {
  Bolt,
  Check,
  Code,
  Cog,
  Gem,
  House,
  Mountain,
} from 'lucide-react'
import './PartnerMarquee.css'

const partnerLogos = [
  {
    name: 'blueenergy',
    icon: <Cog aria-hidden="true" />,
    leading: 'blue',
    strong: 'energy',
  },
  {
    name: 'chekpeople',
    icon: <Check aria-hidden="true" />,
    leading: 'chek',
    strong: 'people',
  },
  {
    name: 'BLUEMOUNT',
    icon: <Mountain aria-hidden="true" />,
    leading: 'BLUE',
    strong: 'MOUNT',
  },
  {
    name: 'cleanhouse',
    icon: <House aria-hidden="true" />,
    leading: 'clean',
    strong: 'house',
  },
  {
    name: 'codelock',
    icon: <Code aria-hidden="true" />,
    leading: 'code',
    strong: 'lock',
  },
  {
    name: 'BLUDIAMOND',
    icon: <Gem aria-hidden="true" />,
    leading: 'BLU',
    strong: 'DIAMOND',
  },
  {
    name: 'brighttrip',
    icon: <Bolt aria-hidden="true" />,
    leading: 'bright',
    strong: 'trip',
  },
]

const marqueeGroups = [0, 1]

export function PartnerMarquee() {
  return (
    <section className="partner-marquee" aria-label="Partner brands">
      <div className="partner-marquee__viewport">
        <div className="partner-marquee__track">
          {marqueeGroups.map((groupIndex) => (
            <div
              className="partner-marquee__group"
              key={groupIndex}
              aria-hidden={groupIndex > 0}
            >
              {partnerLogos.map((logo) => (
                <div
                  className="partner-marquee__item"
                  key={`${groupIndex}-${logo.name}`}
                >
                  {logo.icon}
                  <span>
                    {logo.leading}
                    <strong>{logo.strong}</strong>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
