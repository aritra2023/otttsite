import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import SubscriptionCard from "./SubscriptionCard";

interface SubscriptionsSectionProps {
  searchQuery?: string;
}

export default function SubscriptionsSection({ searchQuery = "" }: SubscriptionsSectionProps) {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = searchQuery 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const transformedProducts = filteredProducts.map(product => ({
    platform: product.name,
    logo: product.image,
    popular: false,
    features: product.description.split('\n').filter(f => f.trim()),
    plans: [
      { duration: "1 Month", months: 1, originalPrice: product.price1MonthActual, discountedPrice: product.price1MonthSelling },
      { duration: "3 Months", months: 3, originalPrice: product.price3MonthActual, discountedPrice: product.price3MonthSelling },
      { duration: "6 Months", months: 6, originalPrice: product.price6MonthActual, discountedPrice: product.price6MonthSelling },
      { duration: "12 Months", months: 12, originalPrice: product.price12MonthActual, discountedPrice: product.price12MonthSelling },
    ],
  }));

  if (isLoading) {
    return (
      <section id="subscriptions" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Premium subscriptions at unbeatable prices
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="subscriptions" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Choose Your Plan</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Premium subscriptions at unbeatable prices
          </p>
        </div>

        {transformedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found. Add products via Telegram bot using /newpost</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedProducts.map((platformData, index) => (
              <SubscriptionCard key={index} {...platformData} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
