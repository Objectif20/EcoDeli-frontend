import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/image-upload";
import type { StepItem } from "@/components/ui/stepper";
import { Step, Stepper, useStepper } from "@/components/ui/stepper";

// Schéma de validation avec Zod
const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  weight: z.string().min(1, "Weight is required"),
  estimatedPrice: z.string().min(1, "Estimated price is required"),
  isFragile: z.boolean(),
  image: z.any().refine((files) => files?.length, "Image is required"),
});

const formSchema = z.object({
  packages: z.array(packageSchema),
});

function PackageForm() {
  const [packages, setPackages] = useState([{ id: 0 }]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packages: packages.map(() => ({
        name: "",
        weight: "",
        estimatedPrice: "",
        isFragile: false,
        image: [],
      })),
    },
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = (data: any) => {
    console.log("Submitted data:", data);
    reset();
  };

  const addPackage = () => {
    setPackages((prev) => [...prev, { id: prev.length }]);
    form.setValue("packages", [
      ...form.getValues("packages"),
      { name: "", weight: "", estimatedPrice: "", isFragile: false, image: [] },
    ]);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="container">
        {packages.map((pkg, index) => (
          <div key={pkg.id} className="mb-4 p-4 border rounded">
            <FormField
              control={control}
              name={`packages.${index}.image`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onImagesChange={(files) => field.onChange(files)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`packages.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'objet</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={control}
                name={`packages.${index}.weight`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Poids de l'objet</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`packages.${index}.estimatedPrice`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Prix estimé</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name={`packages.${index}.isFragile`}
              render={({ field }) => (
                <FormItem className="text-center">
                  <FormLabel>Votre objet est-il fragile ?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
        <Button type="button" onClick={addPackage}>
          Ajouter un colis supplémentaire
        </Button>
        <Button type="submit">Suivant</Button>
      </form>
    </Form>
  );
}

const steps: StepItem[] = [
  { label: "Colis" },
  { label: "Départ" },
  { label: "Arrivée" },
  { label: "Prix" },
];

export function CreateDeliveryPage() {
  const { nextStep, prevStep, resetSteps } =
    useStepper();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, formState } = form;

  const onSubmit = handleSubmit((data) => {
    if (formState.isValid) {
      nextStep();
    }
    console.log("Submitted data:", data);
  });

  return (
    <div className="flex w-full flex-col gap-4 container">
      <Stepper initialStep={0} steps={steps}>
        {steps.map((stepProps, index) => (
          <Step key={stepProps.label} {...stepProps}>
            <div className="bg-secondary text-primary my-2 flex h-40 items-center justify-center rounded-md border">
              <h1 className="text-xl">Étape {index + 1}</h1>
            </div>
            <div>
              {index === 0 ? (
                <Form {...form}>
                  <PackageForm />
                </Form>
              ) : (
                <Input />
              )}
            </div>
          </Step>
        ))}
        <Footer onSubmit={onSubmit} resetSteps={resetSteps} prevStep={prevStep} />
      </Stepper>
    </div>
  );
}

function Footer({
  onSubmit,
  resetSteps,
  prevStep,
}: {
  onSubmit: () => void;
  resetSteps: () => void;
  prevStep: () => void;
}) {
  const { hasCompletedAllSteps, isLastStep } = useStepper();

  return (
    <>
      {hasCompletedAllSteps && (
        <div className="bg-secondary text-primary my-2 flex h-40 items-center justify-center rounded-md border">
          <h1 className="text-xl">Bravo ! Toutes les étapes sont terminées 🎉</h1>
        </div>
      )}
      <div className="flex w-full justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Réinitialiser
          </Button>
        ) : (
          <>
            <Button onClick={prevStep} size="sm" variant="secondary">
              Précédent
            </Button>
            <Button size="sm" onClick={onSubmit}>
              {isLastStep ? "Terminer" : "Suivant"}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
