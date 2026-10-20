import {
  CalendarCheck, HeartHandshake, House, MessageCircleHeart, Palette, Puzzle, School, ShieldCheck, Sparkles, UserPlus, Users,
} from 'lucide-react';

// The names content/clinic.js may use in an `icon` field
export const ICONS = {
  puzzle: Puzzle,
  palette: Palette,
  message: MessageCircleHeart,
  users: Users,
  house: House,
  shield: ShieldCheck,
  heart: HeartHandshake,
  school: School,
  userPlus: UserPlus,
  calendar: CalendarCheck,
  sparkles: Sparkles,
};

export function Icon({ name, ...props }) {
  const Component = ICONS[name] ?? Sparkles;
  return <Component aria-hidden {...props} />;
}
