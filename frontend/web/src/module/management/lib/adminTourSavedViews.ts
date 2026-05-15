const STORAGE_KEY = 'tv-admin-tour-views-v1'
const MAX_VIEWS = 8

export type TourSavedView = {
  id: string
  name: string
  /** Chuỗi query URL (không có ?) */
  query: string
  savedAt: number
}

function readViews(): TourSavedView[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is TourSavedView =>
        typeof x === 'object' &&
        x !== null &&
        typeof (x as TourSavedView).id === 'string' &&
        typeof (x as TourSavedView).name === 'string' &&
        typeof (x as TourSavedView).query === 'string',
    )
  } catch {
    return []
  }
}

function writeViews(views: TourSavedView[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(views.slice(0, MAX_VIEWS)))
  } catch {
    /* ignore */
  }
}

export function listTourSavedViews(): TourSavedView[] {
  return readViews().sort((a, b) => b.savedAt - a.savedAt)
}

export function saveTourViewFromQuery(name: string, queryString: string) {
  const trimmed = name.trim()
  if (!trimmed) return
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const next = [
    { id, name: trimmed, query: queryString.replace(/^\?/, ''), savedAt: Date.now() },
    ...readViews().filter((v) => v.name !== trimmed),
  ]
  writeViews(next)
}

export function deleteTourSavedView(id: string) {
  writeViews(readViews().filter((v) => v.id !== id))
}
