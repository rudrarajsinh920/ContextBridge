export type PageView = 'dashboard' | 'projects' | 'documents';

export interface NavItem {
  id: PageView;
  label: string;
  description: string;
}
