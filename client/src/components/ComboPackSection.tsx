import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import SubscriptionCard from "./SubscriptionCard";

interface ComboPackSectionProps {
  searchQuery?: string;
}

export default function ComboPackSection({ searchQuery = "" }: ComboPackSectionProps) {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const comboProducts = products.filter(product => product.category === "Combo Pack");

  if (searchQuery) {
    return null;
  }

  const filteredProducts = comboProducts;

  const transformedProducts = filteredProducts.map(product => {
    const fixedPlans = [
      { duration: "1 Month", months: 1, originalPrice: product.price1MonthActual, discountedPrice: product.price1MonthSelling, inStock: product.inStock1Month },
      { duration: "3 Months", months: 3, originalPrice: product.price3MonthActual, discountedPrice: product.price3MonthSelling, inStock: product.inStock3Month },
      { duration: "6 Months", months: 6, originalPrice: product.price6MonthActual, discountedPrice: product.price6MonthSelling, inStock: product.inStock6Month },
      { duration: "12 Months", months: 12, originalPrice: product.price12MonthActual, discountedPrice: product.price12MonthSelling, inStock: product.inStock12Month },
    ].filter(plan => plan.originalPrice > 0 && plan.discountedPrice > 0);

    const customPlans = (product.customOptions || []).map(option => ({
      duration: option.label,
      months: 0,
      originalPrice: option.actualPrice,
      discountedPrice: option.sellingPrice,
      inStock: option.inStock,
    }));

    return {
      platform: product.name,
      logo: product.image,
      popular: false,
      features: product.description.split('\n').filter(f => f.trim()),
      plans: [...fixedPlans, ...customPlans],
    };
  });

  if (comboProducts.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section id="combos" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Combo Pack</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Get more value with our exclusive combo packages
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
    <section id="combos" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Combo Pack</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Get more value with our exclusive combo packages
          </p>
        </div>

        {transformedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No combo packs available at the moment</p>
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
