import { Separator } from "@/components/ui/separator";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const GeneralSettings: React.FC = () => {

  const formSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z.string().min(1, "Le prénom est requis"),
    email: z.string().email("Email invalide"),
    newsletter: z.boolean().default(false),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "THIBAUT",
      prenom: "Rémy",
      email: "name@example.com",
      newsletter: true,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const dispatch = useDispatch();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile.includes('PROVIDER');
  const isClient = user?.profile.includes('CLIENT');
  const isMerchant = user?.profile.includes('MERCHANT');
  const isDeliveryman = user?.profile.includes('DELIVERYMAN');

  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: ["Accueil", "Paramètres", "Général"],
      links: ['/office/dashboard'],
    }));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Paramètres généraux</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings" className="font-semibold text-primary active-link">Paramètres généraux</Link>
          <Link to="/office/profile">Profil</Link>
          <Link to="/office/privacy">Confidentialité</Link>
          <Link to="/office/contact-details">Coordonnées</Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions">Abonnements</Link>
          )}
          {(isProvider || isDeliveryman) && (
            <Link to="/office/billing-settings">Facturations</Link>
          )}
          <Link to="/office/reports">Signalements</Link>
        </nav>
        <div className="grid gap-6">
        <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Paramètres généraux</h3>
        <p className="text-sm text-muted-foreground">Modifier vos informations personnelles</p>
      </div>
      <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre prénom" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="votre@email.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newsletter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>J'accepte la Newsletter</FormLabel>
                    <FormDescription>
                      J'accepte de recevoir de la part de EcoDeli des emails concernant des publicités, des offres
                      commerciales ou tout autre type de mails.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">
              Mettre à jour mes informations
            </Button>
          </form>
        </Form>
      </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
