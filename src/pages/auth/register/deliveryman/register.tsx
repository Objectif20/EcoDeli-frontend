'use client'

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslation } from 'react-i18next';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LocationSelector from "@/components/ui/location-input";
import { Language, RegisterApi } from "@/api/register.api";
import SignatureInput from "@/components/ui/signature-input";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { FileUpload } from "@/components/file-upload";

const createFormSchema = (t: (key: string) => string) => {
  return z.object({
    license: z.string().min(1, {
      message: t('client.pages.public.register.deliverymanProfile.licenseError'),
    }),
    professional_email: z.string().email({
      message: t('client.pages.public.register.deliverymanProfile.emailError'),
    }),
    phone_number: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, {
      message: t('client.pages.public.register.deliverymanProfile.phoneError'),
    }),
    country: z.string().min(1, {
      message: t('client.pages.public.register.deliverymanProfile.countryError'),
    }),
    city: z.string().min(1, {
      message: t('client.pages.public.register.deliverymanProfile.cityError'),
    }),
    address: z.string().min(5, {
      message: t('client.pages.public.register.deliverymanProfile.addressError'),
    }),
    postal_code: z.string().regex(/^\d{5}$/, {
      message: t('client.pages.public.register.deliverymanProfile.postalCodeError'),
    }),
    language_id: z.string().optional(),
    signature: z.string().optional(),
  });
};

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

export default function RegisterDeliveryman() {
  const dispatch = useDispatch();
  const [, setCountry] = useState('FR');
  const [, setCountryName] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      dispatch(setBreadcrumb({
        segments: [t('client.pages.public.register.deliverymanProfile.breadcrumb.home'), t('client.pages.public.register.deliverymanProfile.breadcrumb.deliverymanProfile')],
        links: ['/office/dashboard'],
      }));
    }, [dispatch]);
  

  const formSchema = createFormSchema(t);

  useEffect(() => {
    async function fetchLanguages() {
      const languages = await RegisterApi.getLanguage();
      setLanguages(languages.filter(lang => lang.active));
    }
    fetchLanguages();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      license: "",
      professional_email: "",
      phone_number: "",
      country: "",
      city: "",
      address: "",
      postal_code: "",
      language_id: "",
      signature: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {t('client.pages.public.register.deliverymanProfile.title')}
          </CardTitle>
          <CardDescription className="text-center">{t('client.pages.public.register.deliverymanProfile.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="license"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.deliverymanProfile.license')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC123456" {...field} />
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
                      <FormLabel>{t('client.pages.public.register.deliverymanProfile.language')} *</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="professional_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.deliverymanProfile.email')} *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="professional@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.deliverymanProfile.phone')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="+33123456789" {...field} />
                      </FormControl>
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
                      <FormLabel>{t('client.pages.public.register.deliverymanProfile.address')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Delivery St." {...field} />
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
                        <FormLabel>{t('client.pages.public.register.deliverymanProfile.postalCode')} *</FormLabel>
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
                        <FormLabel>{t('client.pages.public.register.deliverymanProfile.city')} *</FormLabel>
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
                        <FormLabel>{t('client.pages.public.register.deliverymanProfile.country')} *</FormLabel>
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
              </div>
             <div className="flex items-center justify-center">
              <FormField
                  control={form.control}
                  name="signature"
                  render={({ field }) => (
                    <FormItem className="mx-auto">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FileUpload multiple={true} maxFiles={3} />
            <p className="mx-2 text-center text-muted-foreground">Vous pourrez ajouter des véhicules ultérieurement une fois votre profil Transporteur validé par un administrateur de EcoDeli</p>

              <Button type="submit" className="w-full">
                {t('client.pages.public.register.deliverymanProfile.continueButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
