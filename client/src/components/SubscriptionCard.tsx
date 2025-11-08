import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  duration: string;
  months: number;
  originalPrice: number;
  discountedPrice: number;
  inStock: boolean;
}

interface SubscriptionCardProps {
  productId: string;
  platform: string;
  logo: string;
  plans: Plan[];
  features: string[];
  popular?: boolean;
}

export default function SubscriptionCard({
  productId,
  platform,
  logo,
  plans,
  features,
  popular = false,
}: SubscriptionCardProps) {
  const [, setLocation] = useLocation();
  const firstInStockIndex = plans.findIndex(plan => plan.inStock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectedPlanIndex, setModalSelectedPlanIndex] = useState(firstInStockIndex >= 0 ? firstInStockIndex : 0);
  const selectedPlan = plans[firstInStockIndex >= 0 ? firstInStockIndex : 0];
  const { addToCart } = useCart();
  const { toast } = useToast();

  const noPlansAvailable = !selectedPlan || plans.length === 0;

  const handleBuyNow = () => {
    if (noPlansAvailable) {
      toast({
        title: "No variants available",
        description: "This product currently has no pricing options.",
        variant: "destructive",
      });
      return;
    }
    if (modalSelectedPlanIndex < 0 || !plans[modalSelectedPlanIndex]?.inStock) {
      toast({
        title: "Product unavailable",
        description: "The selected plan is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    const planToUse = plans[modalSelectedPlanIndex];
    const message = encodeURIComponent(
      `Hi! I want to buy ${platform} ${planToUse.duration} subscription at ₹${planToUse.discountedPrice}`
    );
    window.open(`https://wa.me/919433419022?text=${message}`, "_blank");
    setIsModalOpen(false);
  };

  const handleAddToCart = () => {
    if (noPlansAvailable) {
      toast({
        title: "No variants available",
        description: "This product currently has no pricing options.",
        variant: "destructive",
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleAddToCartFromDrawer = () => {
    if (modalSelectedPlanIndex < 0 || !plans[modalSelectedPlanIndex]?.inStock) {
      toast({
        title: "Product unavailable",
        description: "The selected plan is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    const planToAdd = plans[modalSelectedPlanIndex];
    addToCart({
      platform,
      logo,
      duration: planToAdd.duration,
      months: planToAdd.months,
      originalPrice: planToAdd.originalPrice,
      discountedPrice: planToAdd.discountedPrice,
    });
    toast({
      title: "Added to cart",
      description: `${platform} ${planToAdd.duration} has been added to your cart.`,
    });
    setIsModalOpen(false);
  };

  const savings = noPlansAvailable ? 0 : Math.round(((selectedPlan.originalPrice - selectedPlan.discountedPrice) / selectedPlan.originalPrice) * 100);

  return (
    <>
      <Card 
        className={`relative overflow-visible hover-elevate transition-all duration-300 h-full flex flex-col group cursor-pointer ${popular ? 'border-primary/50' : ''}`}
        onClick={() => setLocation(`/product/${productId}`)}
        data-testid={`card-product-${productId}`}
      >
        {popular && (
          <div className="absolute -top-2 right-3">
            <Badge variant="default" className="shadow-lg text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          </div>
        )}
        <CardContent className="p-6 flex flex-col h-full gap-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2" data-testid={`text-platform-${platform.toLowerCase().replace(/\s+/g, '-')}`}>{platform}</h3>
              <p className="text-xs text-muted-foreground">
                {noPlansAvailable ? "No variants available" : selectedPlan.duration}
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <img src={logo} alt={platform} className="w-full h-full object-contain rounded-lg" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground" data-testid={`text-price-${platform.toLowerCase().replace(/\s+/g, '-')}`}>
                {noPlansAvailable ? "₹0" : `₹${selectedPlan.discountedPrice}`}
              </span>
              {!noPlansAvailable && (
                <span className="text-xs text-muted-foreground line-through">₹{selectedPlan.originalPrice}</span>
              )}
            </div>
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-orange-500 hover:bg-orange-600 text-white border-0 w-fit">Save {savings}%</Badge>
          </div>

          <div className="border-t pt-3 space-y-1.5 flex-1">
            {features.map((feature, index) => (
              <p key={index} className="text-xs text-muted-foreground">
                {feature}
              </p>
            ))}
          </div>

          <Button
            className="w-full group-hover:shadow-lg transition-all rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            data-testid={`button-add-to-cart-${platform.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to cart
          </Button>
        </CardContent>
      </Card>

      <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl font-bold">Choose One</DrawerTitle>
            <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DrawerClose>
          </DrawerHeader>
          
          <div className="px-4 pb-6">
            <RadioGroup value={modalSelectedPlanIndex.toString()} onValueChange={(value) => {
              const selectedIndex = parseInt(value);
              if (plans[selectedIndex].inStock) {
                setModalSelectedPlanIndex(selectedIndex);
              }
            }}>
              <div className="space-y-3 mt-4">
                {plans.map((plan, index) => {
                  const planSavings = Math.round(((plan.originalPrice - plan.discountedPrice) / plan.originalPrice) * 100);
                  const isOutOfStock = !plan.inStock;
                  return (
                    <div key={index} className="relative">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`plan-${index}`}
                        className="peer sr-only"
                        disabled={isOutOfStock}
                      />
                      <Label
                        htmlFor={`plan-${index}`}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          isOutOfStock 
                            ? 'cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-900' 
                            : 'cursor-pointer peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 dark:peer-data-[state=checked]:bg-orange-950/20 hover:bg-accent'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${isOutOfStock ? 'text-gray-400' : ''}`}>
                              {plan.duration}
                            </span>
                            {isOutOfStock && (
                              <span className="text-xs text-gray-400 font-normal">Out of Stock</span>
                            )}
                          </div>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className={`text-lg font-bold ${isOutOfStock ? 'text-gray-400' : ''}`}>
                              ₹{plan.discountedPrice}
                            </span>
                            <span className={`text-sm line-through ${isOutOfStock ? 'text-gray-300' : 'text-muted-foreground'}`}>
                              ₹{plan.originalPrice}
                            </span>
                          </div>
                        </div>
                        <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isOutOfStock 
                            ? 'border-gray-300' 
                            : modalSelectedPlanIndex === index ? 'border-orange-500' : 'border-gray-300'
                        }`}>
                          <div className={`rounded-full bg-orange-500 transition-all ${
                            !isOutOfStock && modalSelectedPlanIndex === index ? 'w-3 h-3' : 'w-0 h-0'
                          }`} />
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            {firstInStockIndex < 0 ? (
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">All plans are currently out of stock</p>
              </div>
            ) : (
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 rounded-lg border-2"
                  onClick={handleAddToCartFromDrawer}
                  disabled={modalSelectedPlanIndex < 0 || !plans[modalSelectedPlanIndex]?.inStock}
                  data-testid={`button-add-to-cart-drawer-${platform.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  Add To Cart
                </Button>
                <Button
                  className="flex-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleBuyNow}
                  disabled={modalSelectedPlanIndex < 0 || !plans[modalSelectedPlanIndex]?.inStock}
                  data-testid={`button-buy-now-${platform.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  Buy Now
                </Button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
