import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import type { PickUpFormValues } from "./types";

export const PickupFormComponent = ({  }: { onFormSubmit: (data: PickUpFormValues) => void }) => {
  const { control } = useFormContext<PickUpFormValues>();


  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">D'où souhaitez-vous faire partir vos colis ?</div>

      <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Entrez l'adresse de récupération" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Entrez le nom de la ville" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code postal</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Saisissez le code postal" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="pickupMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Moyen de récupération des colis</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un moyen de récupération des colis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vehicule">Au pied du véhicule (0€)</SelectItem>
                  <SelectItem value="manutention1">Manutention 1 personne (29€)</SelectItem>
                  <SelectItem value="manutention2">Manutention 2 personnes (59€)</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
