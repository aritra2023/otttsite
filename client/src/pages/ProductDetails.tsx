import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const productId = params?.id;
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const product = products.find((p) => p.id === productId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar onSearch={() => {}} />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => setLocation("/")}>Go to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const allPlans = [
    {
      duration: "1 Month",
      months: 1,
      actualPrice: product.price1MonthActual,
      sellingPrice: product.price1MonthSelling,
      inStock: product.inStock1Month,
    },
    {
      duration: "3 Months",
      months: 3,
      actualPrice: product.price3MonthActual,
      sellingPrice: product.price3MonthSelling,
      inStock: product.inStock3Month,
    },
    {
      duration: "6 Months",
      months: 6,
      actualPrice: product.price6MonthActual,
      sellingPrice: product.price6MonthSelling,
      inStock: product.inStock6Month,
    },
    {
      duration: "12 Months",
      months: 12,
      actualPrice: product.price12MonthActual,
      sellingPrice: product.price12MonthSelling,
      inStock: product.inStock12Month,
    },
  ].filter((plan) => plan.actualPrice > 0 && plan.sellingPrice > 0);

  const customPlans = (product.customOptions || []).map((option) => ({
    duration: option.label,
    months: 0,
    actualPrice: option.actualPrice,
    sellingPrice: option.sellingPrice,
    inStock: option.inStock,
  }));

  const availablePlans = [...allPlans, ...customPlans];

  if (!selectedDuration && availablePlans.length > 0) {
    const firstInStock = availablePlans.find((p) => p.inStock);
    setSelectedDuration(firstInStock?.duration || availablePlans[0].duration);
  }

  const selectedPlan = availablePlans.find((p) => p.duration === selectedDuration);
  const discountPercentage = selectedPlan
    ? Math.round(
        ((selectedPlan.actualPrice - selectedPlan.sellingPrice) /
          selectedPlan.actualPrice) *
          100
      )
    : 0;

  const features = product.description.split("\n").filter((f) => f.trim());

  const handleBuyNow = () => {
    if (!selectedPlan || !selectedPlan.inStock) {
      toast({
        title: "Product unavailable",
        description: "Please select an in-stock plan",
        variant: "destructive",
      });
      return;
    }

    const message = encodeURIComponent(
      `Hi! I want to buy ${product.name} ${selectedPlan.duration} subscription at ₹${selectedPlan.sellingPrice}`
    );
    window.open(`https://wa.me/919433419022?text=${message}`, "_blank");
  };

  const handleAddToCart = () => {
    if (!selectedPlan || !selectedPlan.inStock) {
      toast({
        title: "Product unavailable",
        description: "Please select an in-stock plan",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      platform: product.name,
      logo: product.image,
      duration: selectedPlan.duration,
      months: selectedPlan.months,
      originalPrice: selectedPlan.actualPrice,
      discountedPrice: selectedPlan.sellingPrice,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} (${selectedPlan.duration}) has been added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6 gap-2"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          <div>
            <div className="bg-white dark:bg-card rounded-md p-6 flex items-center justify-center border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-xs h-auto object-contain"
                data-testid="img-product"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-product-name">
                {product.name}
              </h1>
              
              {selectedPlan && (
                <div className="flex items-baseline gap-2 flex-wrap mb-3">
                  <span className="text-2xl md:text-3xl font-bold" data-testid="text-price">
                    ₹{selectedPlan.sellingPrice}
                  </span>
                  {selectedPlan.actualPrice > selectedPlan.sellingPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through" data-testid="text-original-price">
                        ₹{selectedPlan.actualPrice}
                      </span>
                      <Badge className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-300 dark:border-orange-700" data-testid="badge-discount">
                        {discountPercentage}% OFF
                      </Badge>
                    </>
                  )}
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Select Duration:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availablePlans.map((plan) => (
                  <Button
                    key={plan.duration}
                    onClick={() => plan.inStock && setSelectedDuration(plan.duration)}
                    disabled={!plan.inStock}
                    variant={selectedDuration === plan.duration ? "default" : "outline"}
                    className={`
                      h-auto py-2.5 px-3 text-sm font-medium rounded-full
                      ${!plan.inStock ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    data-testid={`button-duration-${plan.duration.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {plan.duration}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button
                onClick={handleBuyNow}
                className="flex-1 text-sm h-10 rounded-full bg-primary hover:bg-primary/90"
                disabled={!selectedPlan?.inStock}
                data-testid="button-buy-now"
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 text-sm h-10 rounded-full gap-2"
                disabled={!selectedPlan?.inStock}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>

            {!selectedPlan?.inStock && (
              <p className="text-xs text-destructive font-medium" data-testid="text-out-of-stock">
                This variant is currently out of stock
              </p>
            )}

            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-md p-3">
              <div className="flex gap-2">
                <Tag className="h-4 w-4 text-orange-600 dark:text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-xs">Special Offer</p>
                  <p className="text-xs text-muted-foreground">
                    Get 5% off on orders above ₹50
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Code: <span className="font-bold">TRYWEBEW00</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <div>
            <h2 className="text-lg font-bold mb-2">Product Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-description">
              Save big with our {product.name} plans, affordable, reliable, and perfect for
              unlimited streaming of movies, shows, and originals every month.
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-bold mb-2">Key Features</h2>
            <ul className="space-y-1.5">
              {features.map((feature, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span data-testid={`text-feature-${idx}`}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <h3 className="text-base font-bold mb-1.5">Q: Will the subscription be activated on my number or Gmail?</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">A:</span> No—the plan is shared. You'll receive unique login and sign in code to
                login, not an activation on your personal email or phone.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold mb-1.5">Q: How will I get my login credentials?</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">A:</span> Simply share your order ID with us on WhatsApp, and we'll send your
                secure {product.name} details.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
