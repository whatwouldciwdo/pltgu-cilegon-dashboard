export interface ApplicationItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
  badge?: string;
  category: 'korporat' | 'unit' | 'it';
}

export type CategoryKey = 'all' | 'korporat' | 'unit' | 'it';
