export function looksLikeHtml(value: string | undefined) {
  if (!value) {
    return false
  }
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

export function buildToursKeywordHref(destinationName: string) {
  const q = encodeURIComponent(destinationName.trim() || 'Vietnam')
  return `/tours?keyword=${q}`
}
