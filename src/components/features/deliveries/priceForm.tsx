import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { PriceChoiceFormValues } from "./types";

export const PriceFormComponent = ({  }: { onFormSubmit: (data: PriceChoiceFormValues) => void }) => {
  const { control } = useFormContext<PriceChoiceFormValues>();


  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">D'où souhaitez-vous faire partir vos colis ?</div>

      <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choisissez un prix</FormLabel>
              <FormControl>
                <div className="relative">
                      <Input
                        {...field}
                        className="peer ps-6 pe-12"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1000000"
                      />
                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                        €
                      </span>
                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                        EUR
                      </span>
                    </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
  );
};
