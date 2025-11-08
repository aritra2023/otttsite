import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Home from "@/pages/Home";
import Cart from "@/pages/Cart";
import FAQPage from "@/pages/FAQPage";
import TermsPage from "@/pages/TermsPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";
import ProductDetails from "@/pages/ProductDetails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/cart" component={Cart} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/admin" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
