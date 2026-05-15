import { useEffect, useMemo, useState } from 'react'

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
  const dep = useMemo(() => sectionIds.join('|'), [sectionIds])

  useEffect(() => {
    const ids = dep.split('|').filter(Boolean)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) {
          return
        }
        const sorted = [...visible].sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )
        const id = sorted[0]?.target.id
        if (id) {
          setActiveId(id)
        }
      },
      {
        root: null,
        rootMargin: '-10% 0px -50% 0px',
        threshold: [0, 0.12, 0.28],
      },
    )

    for (const el of elements) {
      observer.observe(el)
    }

    return () => {
      observer.disconnect()
    }
  }, [dep])

  return activeId
}
