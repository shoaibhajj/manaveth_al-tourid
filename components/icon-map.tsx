import {
  Award,
  ConciergeBell,
  Container,
  Gem,
  Globe,
  Handshake,
  ShieldCheck,
  Ship,
  Store,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { IconKey } from '@/lib/content/types'

export const icons: Record<IconKey, LucideIcon> = {
  concierge: ConciergeBell,
  store: Store,
  truck: Truck,
  ship: Ship,
  award: Award,
  globe: Globe,
  shield: ShieldCheck,
  handshake: Handshake,
  gem: Gem,
  users: Users,
  container: Container,
}
