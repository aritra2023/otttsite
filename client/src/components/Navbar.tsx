import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Eraser, ShoppingCart, Sun, Moon, ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useLocation } from "wouter";
import logoImage from "@assets/20251026_205921_1761492762838.png";
import darkLogoImage from "@assets/20251026_205921_1761567811548.png";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const categories = [
  "Subscriptions",
  "Combo Pack",
  "Adult",
  "Music",
  "Software",
  "Other Items"
];

export default function Navbar({ onSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const cartItemCount = getTotalItems();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const handleSearch = () => {
    onSearch(searchQuery.trim());
    scrollToSection("subscriptions");
    setSearchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const productNames = products.map(p => p.name);
  const topSearches = products.slice(0, 3).map(p => p.name);
  
  const filteredSuggestions = searchQuery 
    ? productNames.filter(name => 
        name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    scrollToSection("subscriptions");
    setSearchOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-black border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Menu Icon */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
            <img 
              key={theme}
              src={theme === "dark" ? darkLogoImage : logoImage} 
              alt="SUBFLIX" 
              className="h-12 md:h-14 w-auto object-contain transition-opacity duration-200"
              data-testid="img-logo"
            />
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
              data-testid="button-theme-toggle"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-foreground transition-transform duration-300 hover:rotate-12" />
              ) : (
                <Sun className="h-5 w-5 text-foreground transition-transform duration-300 hover:rotate-12" />
              )}
            </button>
          </div>

          {/* Right - Search & Cart Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setLocation("/cart")}
              className="p-2 hover:bg-muted rounded-lg transition-colors relative"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" data-testid="text-cart-count">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            data-testid="overlay-mobile-menu"
          />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border z-50 animate-in slide-in-from-left duration-300">
            <div className="px-4 py-6 space-y-2">
              <div className="mb-6">
                <img 
                  src={theme === "dark" ? darkLogoImage : logoImage} 
                  alt="SUBFLIX" 
                  className="h-14 w-auto object-contain"
                  data-testid="img-logo-mobile"
                />
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setLocation("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg font-medium hover:bg-muted/50"
                  data-testid="link-home-mobile"
                >
                  Home
                </button>

                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center justify-between w-full text-left px-4 py-3 rounded-lg font-medium hover:bg-muted/50"
                  data-testid="button-categories-mobile"
                >
                  <span>Categories</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {categoriesOpen && (
                  <div className="pl-4 space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          onSearch(category);
                          scrollToSection("subscriptions");
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50"
                        data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}-mobile`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => scrollToSection("subscriptions")}
                className="block w-full text-left px-4 py-3 rounded-lg font-medium hover:bg-muted/50"
                data-testid="link-pricing-mobile"
              >
                Pricing
              </button>
              
              <div className="space-y-1">
                <button
                  onClick={() => setPrivacyOpen(!privacyOpen)}
                  className="flex items-center justify-between w-full text-left px-4 py-3 rounded-lg font-medium hover:bg-muted/50"
                  data-testid="button-privacy-mobile"
                >
                  <span>Privacy & Policies</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${privacyOpen ? 'rotate-180' : ''}`} />
                </button>
                {privacyOpen && (
                  <div className="pl-4 space-y-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50"
                      data-testid="link-terms-mobile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Terms and Conditions
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50"
                      data-testid="link-store-policies-mobile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Store Policies
                    </button>
                    <button
                      onClick={() => {
                        setLocation("/faq");
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50"
                      data-testid="link-faq-mobile"
                    >
                      FAQ
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-4 py-3 rounded-lg font-medium hover:bg-muted/50"
                data-testid="link-contact-mobile"
              >
                Contact
              </button>
              
              <Button
                variant="default"
                className="w-full mt-4 rounded-full"
                onClick={() => scrollToSection("subscriptions")}
                data-testid="button-get-started-mobile"
              >
                Get Started
              </Button>
            </div>
          </div>
        </>
      )}

<Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogPortal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-0 right-0 top-0 bottom-0 z-50 w-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top duration-200">
            <div className="bg-background/95 backdrop-blur-xl shadow-2xl border-b border-border/50 overflow-hidden max-w-2xl mx-auto h-full">
              <div className="p-6">
                <div className="relative flex items-center gap-3 bg-muted/30 rounded-full px-5 py-3 border border-border/50 focus-within:border-primary transition-all">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground"
                    autoFocus
                    data-testid="input-search"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="p-1 hover:bg-muted rounded-full transition-colors"
                      data-testid="button-clear-search"
                    >
                      <Eraser className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-1.5 hover:bg-muted rounded-full transition-colors"
                    data-testid="button-close-search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                {searchQuery && filteredSuggestions.length > 0 && (
                  <div className="border-t border-border/30">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-6 py-3.5 hover:bg-muted/50 transition-colors flex items-center gap-3 border-b border-border/20 last:border-b-0"
                        data-testid={`suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {!searchQuery && (
                  <div className="px-6 py-4 border-t border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Top Searches</p>
                    <div className="space-y-1">
                      {topSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSuggestionClick(search)}
                          className="w-full text-left px-4 py-2.5 hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-3"
                          data-testid={`top-search-${search.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="px-6 py-6 border-t border-border/30">
                  <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Recommended for you</p>
                  <div className="flex gap-4 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    {products.slice(0, 8).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSuggestionClick(product.name)}
                        className="flex-shrink-0 w-40 group"
                        data-testid={`recommended-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="bg-muted/30 hover:bg-muted/50 rounded-xl p-4 transition-all border border-border/30 hover:border-primary/50 hover:scale-105">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-lg bg-background flex items-center justify-center overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-semibold line-clamp-2">{product.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">₹{product.price1MonthSelling}/mo</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </nav>
  );
}
