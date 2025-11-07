import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@shared/schema";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const productFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Product name is required"),
  image: z.string().url("Must be a valid URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface CustomOption {
  id: string;
  label: string;
  actualPrice: number;
  sellingPrice: number;
  inStock?: boolean;
}

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const [customOptions, setCustomOptions] = useState<CustomOption[]>(
    product?.customOptions || []
  );

  useEffect(() => {
    const filteredOptions = (product?.customOptions || []).filter(
      opt => opt.actualPrice > 0 && opt.sellingPrice > 0
    );
    setCustomOptions(filteredOptions);
    form.reset({
      category: product?.category || "Subscriptions",
      name: product?.name || "",
      image: product?.image || "",
      description: product?.description || "",
    });
  }, [product]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      category: product?.category || "Subscriptions",
      name: product?.name || "",
      image: product?.image || "",
      description: product?.description || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const productData = {
        category: data.category,
        name: data.name,
        image: data.image,
        description: data.description,
        price1MonthActual: 0,
        price1MonthSelling: 0,
        inStock1Month: false,
        price3MonthActual: 0,
        price3MonthSelling: 0,
        inStock3Month: false,
        price6MonthActual: 0,
        price6MonthSelling: 0,
        inStock6Month: false,
        price12MonthActual: 0,
        price12MonthSelling: 0,
        inStock12Month: false,
        customOptions: customOptions
          .filter(opt => opt.actualPrice > 0 && opt.sellingPrice > 0)
          .map(opt => ({
            id: opt.id,
            label: opt.label,
            actualPrice: opt.actualPrice,
            sellingPrice: opt.sellingPrice,
            inStock: opt.inStock !== undefined ? opt.inStock : true,
          })),
      };

      if (product) {
        const response = await apiRequest("PATCH", `/api/products/${product.id}`, productData);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/products", productData);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: product ? "Product Updated" : "Product Created",
        description: product
          ? "Product has been updated successfully"
          : "Product has been created successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: product ? "Failed to update product" : "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const addCustomOption = () => {
    const newOption: CustomOption = {
      id: `custom-${Date.now()}`,
      label: "",
      actualPrice: 0,
      sellingPrice: 0,
      inStock: true,
    };
    setCustomOptions([...customOptions, newOption]);
  };

  const removeCustomOption = (id: string) => {
    setCustomOptions(customOptions.filter(opt => opt.id !== id));
  };

  const updateCustomOption = (id: string, field: keyof CustomOption, value: string | number | boolean) => {
    setCustomOptions(
      customOptions.map(opt =>
        opt.id === id ? { ...opt, [field]: value } : opt
      )
    );
  };

  const onSubmit = (data: ProductFormData) => {
    createMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                  <SelectItem value="Combo Pack">Combo Pack</SelectItem>
                  <SelectItem value="Adult">Adult</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Other Items">Other Items</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Netflix Premium"
                  data-testid="input-name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  data-testid="input-image"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter a direct link to the product image</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the product features and benefits..."
                  className="min-h-[100px]"
                  data-testid="input-description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Pricing Options</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomOption}
              data-testid="button-add-option"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Option
            </Button>
          </div>

          {customOptions.map((option, index) => (
            <div key={option.id} className="border rounded-lg p-3 mb-3 bg-muted/30">
              <div className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-6">
                  <Label className="text-xs mb-1 block">Option Name</Label>
                  <Input
                    placeholder="e.g., 1 Month, 6 Months"
                    value={option.label}
                    onChange={(e) => updateCustomOption(option.id, "label", e.target.value)}
                    data-testid={`input-option-label-${index}`}
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs mb-1 block">Actual Price</Label>
                  <Input
                    type="number"
                    placeholder="299"
                    value={option.actualPrice || ""}
                    onChange={(e) => updateCustomOption(option.id, "actualPrice", Number(e.target.value))}
                    data-testid={`input-option-actual-${index}`}
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs mb-1 block">Selling Price</Label>
                  <Input
                    type="number"
                    placeholder="199"
                    value={option.sellingPrice || ""}
                    onChange={(e) => updateCustomOption(option.id, "sellingPrice", Number(e.target.value))}
                    data-testid={`input-option-selling-${index}`}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`stock-${option.id}`}
                    checked={option.inStock !== false}
                    onCheckedChange={(checked) => updateCustomOption(option.id, "inStock", checked)}
                    data-testid={`switch-stock-${index}`}
                  />
                  <Label htmlFor={`stock-${option.id}`} className="text-sm cursor-pointer">
                    {option.inStock !== false ? "In Stock" : "Out of Stock"}
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomOption(option.id)}
                  data-testid={`button-remove-option-${index}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="ml-1 text-xs">Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createMutation.isPending}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            data-testid="button-submit"
          >
            {createMutation.isPending
              ? "Saving..."
              : product
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
