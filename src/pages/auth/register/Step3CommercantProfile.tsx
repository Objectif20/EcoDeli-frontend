import { useContext, useEffect, useRef, useState } from "react"
import { RegisterContext } from "./RegisterContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTranslation } from 'react-i18next'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LocationSelector from "@/components/ui/location-input"
import { Language, RegisterApi } from "@/api/register.api"
import SignatureInput from "@/components/ui/signature-input"

const createFormSchema = (t: (key: string) => string) => {
  return z.object({
    firstName: z.string().min(2, { message: t('client.pages.public.register.merchantProfile.firstNameError') }),
    lastName: z.string().min(2, { message: t('client.pages.public.register.merchantProfile.lastNameError') }),
    email: z.string().email({ message: t('client.pages.public.register.merchantProfile.emailError') }),
    password: z.string().min(8, { message: t('client.pages.public.register.merchantProfile.passwordError') }),
    confirmPassword: z.string(),
    company_name: z.string().min(2, { message: t('client.pages.public.register.merchantProfile.companyNameError') }),
    siret: z.string().regex(/^\d{14}$/, { message: t('client.pages.public.register.merchantProfile.siretError') }),
    address: z.string().min(5, { message: t('client.pages.public.register.merchantProfile.addressError') }),
    postal_code: z.string().regex(/^\d{5}$/, { message: t('client.pages.public.register.merchantProfile.postalCodeError') }),
    city: z.string().min(2, { message: t('client.pages.public.register.merchantProfile.cityError') }),
    country: z.string().min(2, { message: t('client.pages.public.register.merchantProfile.countryError') }),
    phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, { message: t('client.pages.public.register.merchantProfile.phoneError') }),
    description: z.string().optional(),
    newsletter: z.boolean().default(false),
    language_id: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: t('client.pages.public.register.merchantProfile.termsError'),
    }),
    signature: z.string().min(1, t('client.pages.public.register.providerDocument.signatureError')),

  }).refine((data) => data.password === data.confirmPassword, {
    message: t('client.pages.public.register.merchantProfile.passwordMismatch'),
    path: ["confirmPassword"],
  });
};

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

export default function Step3CommercantProfile() {
  const { nextStep, setCommercantInfo } = useContext(RegisterContext)
  const [, setCountry] = useState('FR');
  const [, setCountryName] = useState('');
  const [languages, setLanguages] = useState<Language[]>([])
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formSchema = createFormSchema(t);

  useEffect(() => {
    async function fetchLanguages() {
      const languages = await RegisterApi.getLanguage()
      setLanguages(languages.filter(lang => lang.active))
    }
    fetchLanguages()
  }, [])

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
      signature: "",
      newsletter: false,
      language_id: "",
      terms: false,
    },
    mode: "onChange",
  })

  const onSubmit = async (values: FormValues) => {
    const { confirmPassword, terms, ...dataToStore } = values;

    const [emailAvailable, siretAvailable] = await Promise.all([
      RegisterApi.isEmailAvailable(values.email),
      RegisterApi.isSiretAvailable(values.siret)
    ]);

    let hasError = false;

    if (!emailAvailable) {
      form.setError("email", {
        type: "manual",
        message: t('client.pages.public.register.merchantProfile.emailAlreadyUsed'),
      });
      hasError = true;
    }

    if (!siretAvailable) {
      form.setError("siret", {
        type: "manual",
        message: t('client.pages.public.register.merchantProfile.siretAlreadyUsed'),
      });
      hasError = true;
    }

    if (hasError) return;

    setCommercantInfo((prev: any) => ({ ...prev, ...dataToStore }));
    nextStep();
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {t('client.pages.public.register.merchantProfile.title')}
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            {t('client.pages.public.register.merchantProfile.message')}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Prénom / Nom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.merchantProfile.lastName')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('client.pages.public.register.merchantProfile.lastNamePlaceholder')} {...field} />
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
                      <FormLabel>{t('client.pages.public.register.merchantProfile.firstName')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('client.pages.public.register.merchantProfile.firstNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.pages.public.register.merchantProfile.email')} *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('client.pages.public.register.merchantProfile.emailPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.merchantProfile.password')} *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('client.pages.public.register.merchantProfile.passwordPlaceholder')} {...field} />
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
                      <FormLabel>{t('client.pages.public.register.merchantProfile.confirmPassword')} *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('client.pages.public.register.merchantProfile.confirmPasswordPlaceholder')} {...field} />
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
                      <FormLabel>{t('client.pages.public.register.merchantProfile.companyName')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('client.pages.public.register.merchantProfile.companyNamePlaceholder')} {...field} />
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
                      <FormLabel>{t('client.pages.public.register.merchantProfile.siret')} *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('client.pages.public.register.merchantProfile.siretPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.pages.public.register.merchantProfile.address')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client.pages.public.register.merchantProfile.addressPlaceholder')} {...field} />
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
                      <FormLabel>{t('client.pages.public.register.merchantProfile.postalCode')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('client.pages.public.register.merchantProfile.postalCodePlaceholder')} {...field} />
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
                      <FormLabel>{t('client.pages.public.register.merchantProfile.city')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('client.pages.public.register.merchantProfile.cityPlaceholder')} {...field} />
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
                      <FormLabel>{t('client.pages.public.register.merchantProfile.country')} *</FormLabel>
                      <LocationSelector
                        onCountryChange={(country) => {
                          setCountry(country?.iso2 || 'FR');
                          setCountryName(country?.name || '');
                          field.onChange(country?.name || '');
                        }}
                        enableStateSelection={false}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.merchantProfile.phone')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('client.pages.public.register.merchantProfile.phonePlaceholder')} {...field} />
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
                      <FormLabel>{t('client.pages.public.register.merchantProfile.language')} *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre langue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang.language_id} value={lang.language_id}>
                              {lang.language_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.pages.public.register.merchantProfile.description')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('client.pages.public.register.merchantProfile.descriptionPlaceholder')} className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <FormLabel>{t('client.pages.public.register.merchantProfile.newsletterLabel')}</FormLabel>
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
                          {t('client.pages.public.register.merchantProfile.termsLabel')}
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="signature"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div>
                        <FormLabel>
                          {t('client.pages.public.register.providerDocument.signatureLabel')}
                        </FormLabel>
                      </div>
                      <div className="mx-auto">
                        <SignatureInput
                          canvasRef={canvasRef}
                          onSignatureChange={field.onChange}
                        />
                      </div>
  
                      <FormDescription>
                        {t('client.pages.public.register.providerDocument.signatureDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                {t('client.pages.public.register.merchantProfile.continueButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
