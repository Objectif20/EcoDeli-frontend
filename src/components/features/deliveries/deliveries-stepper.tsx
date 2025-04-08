"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { defineStepper } from "@/components/ui/stepper"
import type { PackagesFormValues, PickUpEndFormValues, PickUpFormValues, PriceChoiceFormValues } from "./types"
import PackagesFormComponent from "./packageForm"
import { PickupFormComponent } from "./pickUpForm"
import { PickupEndFormComponent } from "./pickUpEndForm"
import { PriceFormComponent } from "./priceForm"

const packageSchema = z.object({
  name: z.string().min(1, "Nom de l'objet est requis"),
  weight: z.string().min(1, "Poids est requis"),
  estimatedPrice: z.string().min(1, "Prix estimé est requis"),
  volume: z.string().min(1, "Volume est requis"),
  isFragile: z.boolean().default(false),
  image: z.any().refine((files) => files?.length, "Une image est au moins requise"),
})

const packagesSchema = z.object({
  packages: z.array(packageSchema).min(1, "Au moins un colis est requis"),
})

export const pickupSchema = z.object({
  address: z.string().min(1, "Adresse requise"),
  postalCode: z.string().min(5, "Code postal requis"),
  city: z.string().min(1, "Ville requise"),
  lat: z.string().optional(),
  lon: z.string().optional(),
  pickupMethod: z.enum(["vehicule", "manutention1", "manutention2"]).refine((val) => !!val, {
    message: "Sélection requise",
  }),
})

export const pickupEndSchema = z.object({
  address: z.string().min(1, "Adresse requise"),
  postalCode: z.string().min(5, "Code postal requis"),
  city: z.string().min(1, "Ville requise"),
  lat: z.string().optional(),
  lon: z.string().optional(),
  pickupMethod: z.enum(["vehicule", "manutention1", "manutention2"]).refine((val) => !!val, {
    message: "Sélection requise",
  }),
})

export const priceChoiceSchema = z.object({
  price : z.string().min(0, "Prix requis"),
})

const { StepperProvider, StepperControls, StepperNavigation, StepperStep, StepperTitle, useStepper } = defineStepper(
  {
    id: "packages",
    title: "Colis",
    schema: packagesSchema,
    Component: PackagesFormComponent,
  },
  {
    id: "pickup",
    title: "Départ",
    schema: pickupSchema,
    Component: PickupFormComponent,
  },
  {
    id: "pickupEnd",
    title: "Arrivée",
    schema: pickupEndSchema,
    Component: PickupEndFormComponent,
  },
  {
    id: "price",
    title: "Prix",
    schema: priceChoiceSchema,
    Component: PriceFormComponent,
  },
  {
    id : "summary",
    title : "Résumé",
    schema : z.object({}),
    Component : () => <div>Résumé de la commande</div>,
  }
)

export function DeliveriesStepper() {
  const [formData, setFormData] = useState<{
    packages: PackagesFormValues | null
    pickup: PickUpFormValues | null
    pickupEnd: PickUpEndFormValues | null
    price : PriceChoiceFormValues | null
  }>({
    packages: null,
    pickup: null,
    pickupEnd: null,
    price : null,
  })

  return (
    <StepperProvider>
      <FormStepperComponent formData={formData} setFormData={setFormData} />
    </StepperProvider>
  )
}

type FormStepperProps = {
  formData: {
    packages: PackagesFormValues | null
    pickup: PickUpFormValues | null
    pickupEnd: PickUpEndFormValues | null
    price : PriceChoiceFormValues | null
  }
  setFormData: React.Dispatch<
    React.SetStateAction<{
      packages: PackagesFormValues | null
      pickup: PickUpFormValues | null
      pickupEnd: PickUpEndFormValues | null
      price : PriceChoiceFormValues | null
    }>
  >
}

const FormStepperComponent = ({ formData, setFormData }: FormStepperProps) => {
  const methods = useStepper()

  const getDefaultValues = (step: string) => {
    if (step === "packages") {
      return { packages: [{ name: "", weight: "", estimatedPrice: "", volume: "", isFragile: false, image: null }] }
    }
    if (step === "pickup" || step === "pickupEnd") {
      return { address: "", city: "", postalCode: "", pickupMethod: "", lat: "", lon: "" }
    }
    if (step === "price") {
      return { price: "0" }
    }
    return {}
  }

  const form = useForm<any>({
    mode: "onTouched",
    resolver: zodResolver(methods.current.schema as z.ZodType<any>),
    defaultValues: formData[methods.current.id as keyof typeof formData] || getDefaultValues(methods.current.id),
  })

  const onSubmit = async (values: any) => {

      console.log("Form submitted with values:", values)

    if (methods.current.id === "packages") {
      setFormData((prev) => ({ ...prev, packages: values }))
    } else if (methods.current.id === "pickup") {
      setFormData((prev) => ({ ...prev, pickup: values }))
    } else if (methods.current.id === "pickupEnd") {
      setFormData((prev) => ({ ...prev, pickupEnd: values }))
    } else if (methods.current.id === "price") {
      setFormData((prev) => ({ ...prev, price: values }))
    }

    if (methods.isLast) {
      console.log("Form completed with data:", formData)
      return
    }

    methods.next()
  }

  useEffect(() => {
    form.reset(formData[methods.current.id as keyof typeof formData] || getDefaultValues(methods.current.id))
  }, [methods.current.id])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <StepperNavigation className="border-b pb-4">
              {methods.all.map((step) => (
                <StepperStep
                  key={step.id}
                  of={step.id}
                  onClick={async () => {
                    if (step.id !== methods.current.id) {
                      const valid = await form.trigger()
                      if (!valid) return

                      const currentValues = form.getValues()
                      if (methods.current.id === "packages") {
                        setFormData((prev) => ({ ...prev, packages: currentValues }))
                      } else if (methods.current.id === "pickup") {
                        setFormData((prev) => ({ ...prev, pickup: currentValues }))
                      } else if (methods.current.id === "pickupEnd") {
                        setFormData((prev) => ({ ...prev, pickupEnd: currentValues }))
                      } else if (methods.current.id === "price") {
                        setFormData((prev) => ({ ...prev, price: currentValues }))
                      }

                      form.reset(formData[step.id as keyof typeof formData] || getDefaultValues(step.id))
                      methods.goTo(step.id)
                    }
                  }}
                >
                  <StepperTitle>{step.title}</StepperTitle>
                </StepperStep>
              ))}
            </StepperNavigation>
            <div className="min-h-[400px]">
              {methods.switch({
                packages: ({ Component }) => <Component onFormSubmit={onSubmit} />,
                pickup: ({ Component }) => <Component onFormSubmit={onSubmit} />,
                pickupEnd: ({ Component }) => <Component onFormSubmit={onSubmit} />,
                price: ({ Component }) => <Component onFormSubmit={onSubmit} />,
              })}
            </div>
            <StepperControls>
              {!methods.isFirst && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentValues = form.getValues()
                    if (methods.current.id === "packages") {
                      setFormData((prev) => ({ ...prev, packages: currentValues }))
                    } else if (methods.current.id === "pickup") {
                      setFormData((prev) => ({ ...prev, pickup: currentValues }))
                    } else if (methods.current.id === "pickupEnd") {
                      setFormData((prev) => ({ ...prev, pickupEnd: currentValues }))
                    } else if (methods.current.id === "price") {
                      setFormData((prev) => ({ ...prev, price: currentValues }))
                    }

                    methods.prev()

                    const currentIndex = methods.all.findIndex((step) => step.id === methods.current.id)
                    const prevStepId = methods.all[currentIndex - 1]?.id
                    if (prevStepId) {
                      form.reset(formData[prevStepId as keyof typeof formData] || getDefaultValues(prevStepId))
                    }
                  }}
                >
                  Précédent
                </Button>
              )}
              <Button type="submit">{methods.isLast ? "Terminer" : "Suivant"}</Button>
            </StepperControls>
          </form>
        </Form>
      </FormProvider>
    </div>
  )
}
