import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
  const finalPrice = selectedPlan?.sellingPrice || 0;
  
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
      `Hi! I want to buy ${product.name} ${selectedPlan.duration} subscription at ₹${finalPrice}`
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
      discountedPrice: finalPrice,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} (${selectedPlan.duration}) has been added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6 gap-2 hidden md:flex"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 lg:auto-rows-fr">
          <div className="bg-white dark:bg-card rounded-md p-4 flex items-center justify-center border">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-[200px] h-auto object-contain"
              data-testid="img-product"
            />
          </div>

          <div className="space-y-4 bg-white dark:bg-card rounded-md p-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-3" data-testid="text-product-name">
                {product.name}
              </h1>
              
              {selectedPlan && (
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl md:text-2xl font-bold" data-testid="text-price">
                    ₹{finalPrice}
                  </span>
                  {selectedPlan.actualPrice > selectedPlan.sellingPrice && (
                    <>
                      <span className="text-base text-muted-foreground line-through" data-testid="text-original-price">
                        ₹{selectedPlan.actualPrice}
                      </span>
                      <Badge className="text-xs px-2 py-0.5 bg-orange-500 text-white dark:bg-orange-600" data-testid="badge-discount">
                        {discountPercentage}% OFF
                      </Badge>
                    </>
                  )}
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Select Duration:</span>
              </div>
              <Select
                value={selectedDuration}
                onValueChange={(value) => {
                  const plan = availablePlans.find(p => p.duration === value);
                  if (plan?.inStock) {
                    setSelectedDuration(value);
                  }
                }}
              >
                <SelectTrigger className="w-full rounded-full bg-background dark:bg-card border border-border dark:border-border focus:ring-0" data-testid="select-duration">
                  <SelectValue placeholder="Choose duration" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlans.map((plan) => (
                    <SelectItem
                      key={plan.duration}
                      value={plan.duration}
                      disabled={!plan.inStock}
                      data-testid={`option-duration-${plan.duration.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {plan.duration} {!plan.inStock && "(Out of Stock)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative bg-gradient-to-r from-orange-500/20 to-orange-600/20 dark:from-orange-500/25 dark:to-orange-600/25 rounded-lg border-2 border-dashed border-orange-500/50 dark:border-orange-500/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-3 items-center flex-1">
                  <div className="bg-orange-500/30 dark:bg-orange-500/30 p-2 rounded-full">
                    <Tag className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-orange-700 dark:text-orange-400">Special Offer</p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-500">
                      ₹10 OFF
                    </p>
                  </div>
                </div>
                <div className="text-right border-l-2 border-dashed border-orange-500/40 pl-3">
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">CODE</p>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-500 tracking-wider">
                    TRYSUBFLIX
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-500 mt-0.5 font-medium">
                    Apply on WP
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
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
          </div>
        </div>

        <div className="space-y-4 mb-16 px-3 lg:px-0">
          <div>
            <h2 className="text-base font-bold mb-3">Product Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-description">
              Save big with our {product.name} plans, affordable, reliable, and perfect for
              unlimited streaming of movies, shows, and originals every month.
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="text-base font-bold mb-3">Key Features</h2>
            <ul className="space-y-2">
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
              <h3 className="text-sm font-bold mb-2">Q: Will the subscription be activated on my number or Gmail?</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">A:</span> No—the plan is shared. You'll receive unique login and sign in code to
                login, not an activation on your personal email or phone.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-2">Q: How will I get my login credentials?</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">A:</span> Simply share your order ID with us on WhatsApp, and we'll send your
                secure {product.name} details.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges Section */}
        <div className="mb-8 px-3 lg:px-0">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 py-6 bg-muted/30 rounded-lg">
            {/* Google Trusted Store */}
            <div className="flex items-center gap-2">
              <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" fill="#4285F4"/>
                <path d="M20 26l-4-4-2 2 6 6 12-12-2-2z" fill="white"/>
              </svg>
              <div>
                <p className="text-sm font-bold text-foreground">Google</p>
                <p className="text-xs text-muted-foreground">Trusted Store</p>
              </div>
            </div>

            {/* MSME Badge */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ministry of MSME</p>
                <p className="text-xs font-bold text-foreground">Govt. of India</p>
              </div>
            </div>

            {/* Trustpilot */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">4.7/5.0</p>
                <p className="text-xs text-muted-foreground">( 1,437 Ratings )</p>
              </div>
            </div>
          </div>
        </div>

        {/* More in Category Section */}
        <div className="mb-12 px-3 lg:px-0">
          <h2 className="text-xl font-bold mb-4">More in category</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {products
              .filter((p) => p.id !== productId && p.category === product.category)
              .slice(0, 10)
              .map((relatedProduct) => (
                <button
                  key={relatedProduct.id}
                  onClick={() => setLocation(`/product/${relatedProduct.id}`)}
                  className="flex-shrink-0 w-40 group"
                  data-testid={`related-product-${relatedProduct.id}`}
                >
                  <div className="bg-white dark:bg-card rounded-lg p-4 transition-all border border-border hover:border-primary/50 hover:scale-105 hover-elevate">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-lg bg-background flex items-center justify-center overflow-hidden">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-center w-full">
                        <p className="text-sm font-semibold line-clamp-2">
                          {relatedProduct.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
