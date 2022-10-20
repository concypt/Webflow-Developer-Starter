export interface Product {
  id: number;
  price: number;
  description: string;
  category: Category;
  image: string;
  rating: Rating;
  title: string;
}

const enum Category {
  Electronics = 'electronics',
  Jewelery = 'jewelery',
  MenSClothing = "men's clothing",
  WomenSClothing = "women's clothing",
}

interface Rating {
  rate: number;
  count: number;
}
