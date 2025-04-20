"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { XIcon } from "lucide-react";
import { ServiceApi } from "@/api/service.api";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Tag, TagInput } from "emblor"
import { useId } from "react";



const FormSchema = z.object({
  service_type: z.string().min(1, "Type de service requis"),
  name: z.string().min(2, "Nom requis"),
  description: z.string().min(10, "Description trop courte"),
  city: z.string().min(1, "Ville requise"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Prix invalide"),
  duration_minute: z.string().regex(/^\d+$/, "Durée invalide"),
  keywords: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions.",
  }),
});

export default function CreateService() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      service_type: "",
      name: "",
      description: "",
      city: "",
      price: "",
      duration_minute: "",
      keywords: "",
      acceptTerms: false,
    },
  });

  const [keywords, setKeywords] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const id = useId();


  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
    useEffect(() => {
      dispatch(
        setBreadcrumb({
          segments: ["Accueil", "Mes prestations", "Créer une prestation"],
          links: ["/office/dashboard", "/office/my-services"],
        })
      );
    }, [dispatch]);

  const onDrop = (acceptedFiles: File[]) => {
    setImages(prev => [...prev, ...acceptedFiles].slice(0, 5));
    setImageError("");
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 5,
    onDrop,
  });

  function onSubmit(data: any) {
    if (images.length === 0) {
      setImageError("Vous devez ajouter au moins une image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("service_type", data.service_type);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("city", data.city);
    formData.append("price", data.price);
    formData.append("duration_minute", data.duration_minute);
    if (data.keywords) {
      data.keywords.split(",").map((k: string) => k.trim()).forEach((keyword: string) => {
      formData.append("keywords[]", keyword);
      });
    }
    formData.append("status", "pending");
    formData.append("available", "true");
    formData.append("validated", "false");

  
    images.forEach((image, index) => {
      formData.append(`image${index + 1}`, image);
    });
  
    ServiceApi.createService(formData)
      .then(() => {
        navigate("/office/services/success");
      })
      .catch(error => {
        console.error("Erreur lors de la création du service:", error);
      });
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Créer une nouvelle prestation</h1>
      <p className="text-gray-600 mb-6">
        Remplissez les informations ci-dessous pour proposer votre prestation sur notre plateforme.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField control={form.control} name="service_type" render={({ field }) => (
            <FormItem>
              <FormLabel>Type de service</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la prestation</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem>
              <FormLabel>Prix</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="duration_minute" render={({ field }) => (
            <FormItem>
              <FormLabel>Durée (en minutes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

        <div className="space-y-2">
            <Label htmlFor={id}>Mots-clés</Label>
            <TagInput
              id={id}
              tags={keywords}
              setTags={setKeywords}
              placeholder="Ajoutez un mot-clé"
              styleClasses={{
                tagList: { container: "gap-1" },
                input:
                  "rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                tag: {
                  body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                  closeButton:
                    "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                },
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
              inlineTags={false}
              inputFieldPosition="top"
            />
          </div>

          <FormField control={form.control} name="acceptTerms" render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>J'accepte qu'EcoDeli analyse ma prestation</FormLabel>
              <FormMessage />
            </FormItem>
          )} />

          <div className="w-full flex flex-col items-center gap-4 border p-4 rounded-lg">
            <div {...getRootProps()} className={`w-full border-2 border-dashed p-4 ${isDragActive ? 'ring-2 ring-blue-500' : ''}`}>
              <input {...getInputProps()} />
              <Button type="button" variant="outline" className="w-full">Ajouter des images</Button>
            </div>
            {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
            <div className="flex gap-2 overflow-auto">
              {images.map((file, i) => (
                <div key={i} className="relative w-32 h-32">
                  <img src={URL.createObjectURL(file)} alt={`preview-${i}`} className="w-full h-full object-cover rounded-md border" />
                  <button className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full" onClick={() => removeImage(i)}>
                    <XIcon size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">Envoyer ma demande de prestation</Button>
        </form>
      </Form>
    </div>
  );
}
