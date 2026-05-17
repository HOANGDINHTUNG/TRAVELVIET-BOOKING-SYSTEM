import { createContext, useContext } from 'react'

type CommandPaletteContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

/**
 * Context dùng để bất cứ component nào (Header button, FAB, custom hook…)
 * cũng mở/đóng được palette mà không cần truyền prop. Default object
 * no-op cho phép code không crash khi render ngoài Provider (vd. trang
 * `/management` không mount Provider).
 */
export const CommandPaletteContext = createContext<CommandPaletteContextValue>(
  {
    open: false,
    setOpen: () => {},
    toggle: () => {},
  },
)

/** Hook dùng trong UI tree để control palette. */
export function useCommandPalette() {
  return useContext(CommandPaletteContext)
}
