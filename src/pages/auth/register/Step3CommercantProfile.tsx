"use client"

import { useContext } from "react"
import { RegisterContext } from "./RegisterContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Logo from "@/assets/logo.svg"

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "Le prénom doit contenir au moins 2 caractères.",
    }),
    lastName: z.string().min(2, {
      message: "Le nom doit contenir au moins 2 caractères.",
    }),
    birthDate: z.date({
      required_error: "Veuillez sélectionner une date.",
    }),
    nationality: z.string({
      required_error: "Veuillez sélectionner une nationalité.",
    }),

    email: z.string().email({
      message: "Veuillez entrer une adresse email valide.",
    }),
    password: z.string().min(8, {
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    }),
    confirmPassword: z.string(),

    company_name: z.string().min(2, {
      message: "Le nom de l'entreprise doit contenir au moins 2 caractères.",
    }),
    siret: z.string().regex(/^\d{14}$/, {
      message: "Le numéro SIRET doit contenir 14 chiffres.",
    }),
    business_sector: z.string({
      required_error: "Veuillez sélectionner un secteur d'activité.",
    }),

    address: z.string().min(5, {
      message: "L'adresse doit contenir au moins 5 caractères.",
    }),
    postal_code: z.string().regex(/^\d{5}$/, {
      message: "Le code postal doit contenir 5 chiffres.",
    }),
    city: z.string().min(2, {
      message: "La ville doit contenir au moins 2 caractères.",
    }),
    country: z.string().min(2, {
      message: "Le pays doit contenir au moins 2 caractères.",
    }),

    phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, {
      message: "Veuillez entrer un numéro de téléphone valide.",
    }),
    description: z.string().optional(),
    newsletter: z.boolean().default(false),
    language_id: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions générales.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

export default function Step3CommercantProfile() {
  const { nextStep, setCommercantInfo } = useContext(RegisterContext)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      company_name: "",
      siret: "",
      address: "",
      description: "",
      postal_code: "",
      city: "",
      country: "",
      phone: "",
      newsletter: false,
      language_id: "",
      terms: false,
    },
  })

  function onSubmit(values: FormValues) {
    const { confirmPassword, terms, ...dataToStore } = values
    setCommercantInfo((prev: any) => ({ ...prev, ...dataToStore }))
    nextStep()
  }

  const nationalities = [
    { value: "fr", label: "Française" },
    { value: "be", label: "Belge" },
    { value: "ch", label: "Suisse" },
    { value: "ca", label: "Canadienne" },
    { value: "other", label: "Autre" },
  ]

  const businessSectors = [
    { value: "restaurant", label: "Restaurant gastronomique" },
    { value: "grocery", label: "Épicerie" },
    { value: "bakery", label: "Boulangerie" },
    { value: "butcher", label: "Boucherie" },
    { value: "farm", label: "Producteur" },
    { value: "other", label: "Autre" },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <div className="mr-4">
          <img src={Logo} alt="EcoDeli Logo" className="h-20 w-20" />
        </div>
        <h1 className="text-2xl font-bold">EcoDeli</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Compléter votre profil commerçant</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${
                                !field.value ? "text-muted-foreground" : ""
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: fr })
                              ) : (
                                <span>JJ/MM/AAAA</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationalité *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une nationalité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {nationalities.map((nationality) => (
                            <SelectItem key={nationality.value} value={nationality.value}>
                              {nationality.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="exemple@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="hidden md:block" />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ma Société" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="siret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de Siret *</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678901234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secteur d'activité *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un secteur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessSectors.map((sector) => (
                            <SelectItem key={sector.value} value={sector.value}>
                              {sector.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 rue de Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal *</FormLabel>
                        <FormControl>
                          <Input placeholder="75001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville *</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pays *</FormLabel>
                        <FormControl>
                          <Input placeholder="France" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl>
                        <Input placeholder="0612345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Langue</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une langue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">Anglais</SelectItem>
                          <SelectItem value="es">Espagnol</SelectItem>
                          <SelectItem value="de">Allemand</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Décrivez votre entreprise..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>S'inscrire à la newsletter</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          J'accepte{" "}
                          <a href="#" className="text-primary underline" onClick={(e) => e.preventDefault()}>
                            les conditions générales
                          </a>{" "}
                          du site EcoDeli
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                Continuer
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

