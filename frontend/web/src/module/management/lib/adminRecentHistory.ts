const STORAGE_KEY = 'tv-admin-recent-v1'
const MAX = 5

export type AdminRecentEntry = {
  id: string
  kind: 'route' | 'tour' | 'booking'
  title: string
  subtitle?: string
  path: string
  at: number
}

function readAll(): AdminRecentEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is AdminRecentEntry =>
        typeof x === 'object' &&
        x !== null &&
        typeof (x as AdminRecentEntry).id === 'string' &&
        typeof (x as AdminRecentEntry).title === 'string' &&
        typeof (x as AdminRecentEntry).path === 'string' &&
        typeof (x as AdminRecentEntry).at === 'number',
    )
  } catch {
    return []
  }
}

function writeAll(entries: AdminRecentEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX)))
  } catch {
    /* quota / private mode */
  }
}

export function readAdminRecent(): AdminRecentEntry[] {
  return readAll()
    .sort((a, b) => b.at - a.at)
    .slice(0, MAX)
}

export function recordAdminRecent(entry: Omit<AdminRecentEntry, 'at'> & { at?: number }) {
  const at = entry.at ?? Date.now()
  const id = entry.id
  const next = readAll().filter((e) => e.id !== id)
  next.unshift({ ...entry, at })
  writeAll(next)
}
