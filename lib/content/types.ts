export type IconKey =
  | 'concierge'
  | 'store'
  | 'truck'
  | 'ship'
  | 'award'
  | 'globe'
  | 'shield'
  | 'handshake'
  | 'gem'
  | 'users'
  | 'container'

type Orderable = { order: number; visible?: boolean }

export function visibleSorted<T extends Orderable>(items: readonly T[]): T[] {
  return items.filter((item) => item.visible !== false).sort((a, b) => a.order - b.order)
}
