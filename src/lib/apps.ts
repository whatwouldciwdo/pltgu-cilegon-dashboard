import appsKorporat from '@/data/apps-korporat.json';
import appsUnit from '@/data/apps-unit.json';
import appsIt from '@/data/apps-it.json';
import { ApplicationItem } from '@/types/app';

export function getAllApplications(): ApplicationItem[] {
  const korporatList: ApplicationItem[] = (appsKorporat as any[]).map((item) => ({
    name: item.name,
    href: item.href,
    icon: item.icon,
    badge: item.badge,
    category: 'korporat',
  }));

  const unitList: ApplicationItem[] = (appsUnit as any[]).map((item) => ({
    name: item.name,
    href: item.href,
    icon: item.icon || '',
    description: item.description,
    badge: item.badge,
    category: 'unit',
  }));

  const itList: ApplicationItem[] = (appsIt as any[]).map((item) => ({
    name: item.name,
    href: item.href,
    icon: item.icon || '',
    description: item.description,
    badge: item.badge,
    category: 'it',
  }));

  return [...unitList, ...itList, ...korporatList];
}
