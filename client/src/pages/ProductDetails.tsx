import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, ShoppingCart, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
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
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    features: true,
    faq: true,
  });
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen">
      <Navbar onSearch={() => {}} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-4"
          data-testid="button-back"
        >
          <X className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-black dark:bg-gray-900 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                    data-testid="img-product"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-product-name">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3 mb-4">
                {selectedPlan && (
                  <>
                    <span className="text-3xl font-bold text-primary" data-testid="text-price">
                      ₹{selectedPlan.sellingPrice}
                    </span>
                    {selectedPlan.actualPrice > selectedPlan.sellingPrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through" data-testid="text-original-price">
                          ₹{selectedPlan.actualPrice}
                        </span>
                        <Badge variant="destructive" data-testid="badge-discount">
                          {discountPercentage}% OFF
                        </Badge>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Duration:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availablePlans.map((plan) => (
                  <Button
                    key={plan.duration}
                    variant={selectedDuration === plan.duration ? "default" : "outline"}
                    onClick={() => setSelectedDuration(plan.duration)}
                    disabled={!plan.inStock}
                    className="w-full"
                    data-testid={`button-duration-${plan.duration.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {plan.duration}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBuyNow}
                className="flex-1 bg-primary text-primary-foreground"
                disabled={!selectedPlan?.inStock}
                data-testid="button-buy-now"
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1"
                disabled={!selectedPlan?.inStock}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>

            {!selectedPlan?.inStock && (
              <p className="text-sm text-destructive" data-testid="text-out-of-stock">
                This variant is currently out of stock
              </p>
            )}

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Offers</h4>
                    <p className="text-sm text-muted-foreground">
                      Get 5% off on orders above ₹50
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use code: TRYWEBEW00 for 5% off
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      *Coupons can be applied at checkout
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <button
                onClick={() => toggleSection("description")}
                className="flex items-center justify-between w-full text-left"
                data-testid="button-toggle-description"
              >
                <h2 className="text-xl font-semibold">Product Description</h2>
                {expandedSections.description ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {expandedSections.description && (
                <>
                  <Separator className="my-4" />
                  <p className="text-muted-foreground" data-testid="text-description">
                    Save big with our {product.name} plans, affordable, reliable, and perfect for
                    unlimited streaming of movies, shows, and originals every month.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <button
                onClick={() => toggleSection("features")}
                className="flex items-center justify-between w-full text-left"
                data-testid="button-toggle-features"
              >
                <h2 className="text-xl font-semibold">More Details</h2>
                {expandedSections.features ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {expandedSections.features && (
                <>
                  <Separator className="my-4" />
                  <ul className="space-y-3">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span className="text-muted-foreground" data-testid={`text-feature-${idx}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <button
                onClick={() => toggleSection("faq")}
                className="flex items-center justify-between w-full text-left"
                data-testid="button-toggle-faq"
              >
                <h2 className="text-xl font-semibold">Q&A</h2>
                {expandedSections.faq ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {expandedSections.faq && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold mb-2">
                        Q: Will the subscription be activated on my number or Gmail?
                      </p>
                      <p className="text-sm text-muted-foreground">
                        A: No—the plan is shared. You'll receive unique login and sign in code to
                        login, not an activation on your personal email or phone.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-semibold mb-2">
                        Q: How will I get my login credentials?
                      </p>
                      <p className="text-sm text-muted-foreground">
                        A: Simply share your order ID with us on WhatsApp, and we'll send your
                        secure {product.name} details.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
