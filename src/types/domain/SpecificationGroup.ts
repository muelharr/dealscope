export interface SpecificationItem {
  label: string;
  value: string;
}

export interface SpecificationGroup {
  id: string;
  title: string;
  items: SpecificationItem[];
}
