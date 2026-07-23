export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string;
  subCategories: Category[];
}
