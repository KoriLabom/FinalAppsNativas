export interface Product {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    featured: boolean;
    labels: string[];
    recommendedFor: number;
    discount: number;
    hasHappyHour: boolean;
}
