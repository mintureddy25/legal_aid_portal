import {
  Users,
  Scale,
  Home,
  ShoppingCart,
  Briefcase,
  ShieldAlert,
  Globe,
  Coins,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  family: Users,
  scale: Scale,
  home: Home,
  cart: ShoppingCart,
  briefcase: Briefcase,
  shield: ShieldAlert,
  globe: Globe,
  coins: Coins,
  dots: MoreHorizontal,
};

export function CatIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? MoreHorizontal;
  return <Icon className={className} aria-hidden="true" />;
}
