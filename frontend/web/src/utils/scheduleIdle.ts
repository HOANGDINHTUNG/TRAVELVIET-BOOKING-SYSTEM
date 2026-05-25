/**
 * Chạy callback sau khi main thread rảnh — ưu tiên FCP/LCP trước GSAP/animation nặng.
 */
export function scheduleIdleTask(
  task: () => void | (() => void),
  options?: { timeout?: number },
): () => void {
  let teardown: void | (() => void)

  const run = () => {
    teardown = task()
  }

  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(run, {
      timeout: options?.timeout ?? 2_000,
    })
    return () => {
      window.cancelIdleCallback(id)
      if (typeof teardown === 'function') teardown()
    }
  }

  const timer = window.setTimeout(run, 0)
  return () => {
    window.clearTimeout(timer)
    if (typeof teardown === 'function') teardown()
  }
}
