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

const productFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Product name is required"),
  image: z.string().url("Must be a valid URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  actualPrice: z.coerce.number().min(1, "Actual price must be greater than 0"),
  discountedPrice: z.coerce.number().min(1, "Discounted price must be greater than 0"),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface CustomOption {
  id: string;
  label: string;
  actualPrice: number;
  sellingPrice: number;
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
    setCustomOptions(product?.customOptions || []);
    form.reset({
      category: product?.category || "OTT",
      name: product?.name || "",
      image: product?.image || "",
      description: product?.description || "",
      actualPrice: product?.price1MonthActual || 0,
      discountedPrice: product?.price1MonthSelling || 0,
    });
  }, [product]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      category: product?.category || "OTT",
      name: product?.name || "",
      image: product?.image || "",
      description: product?.description || "",
      actualPrice: product?.price1MonthActual || 0,
      discountedPrice: product?.price1MonthSelling || 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const productData = {
        category: data.category,
        name: data.name,
        image: data.image,
        description: data.description,
        price1MonthActual: data.actualPrice,
        price1MonthSelling: data.discountedPrice,
        inStock1Month: true,
        price3MonthActual: data.actualPrice * 3,
        price3MonthSelling: data.discountedPrice * 3,
        inStock3Month: true,
        price6MonthActual: data.actualPrice * 6,
        price6MonthSelling: data.discountedPrice * 6,
        inStock6Month: true,
        price12MonthActual: data.actualPrice * 12,
        price12MonthSelling: data.discountedPrice * 12,
        inStock12Month: true,
        customOptions: customOptions.map(opt => ({
          id: opt.id,
          label: opt.label,
          actualPrice: opt.actualPrice,
          sellingPrice: opt.sellingPrice,
          inStock: true,
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
    };
    setCustomOptions([...customOptions, newOption]);
  };

  const removeCustomOption = (id: string) => {
    setCustomOptions(customOptions.filter(opt => opt.id !== id));
  };

  const updateCustomOption = (id: string, field: keyof CustomOption, value: string | number) => {
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OTT">OTT Platform</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="actualPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Price (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="499"
                    data-testid="input-actual-price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="299"
                    data-testid="input-selling-price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Additional Options (Optional)</h3>
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
            <div key={option.id} className="grid grid-cols-12 gap-2 mb-2 items-end">
              <div className="col-span-5">
                <Input
                  placeholder="Option name"
                  value={option.label}
                  onChange={(e) => updateCustomOption(option.id, "label", e.target.value)}
                  data-testid={`input-option-label-${index}`}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="Actual"
                  value={option.actualPrice || ""}
                  onChange={(e) => updateCustomOption(option.id, "actualPrice", Number(e.target.value))}
                  data-testid={`input-option-actual-${index}`}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="Selling"
                  value={option.sellingPrice || ""}
                  onChange={(e) => updateCustomOption(option.id, "sellingPrice", Number(e.target.value))}
                  data-testid={`input-option-selling-${index}`}
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomOption(option.id)}
                  data-testid={`button-remove-option-${index}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
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
