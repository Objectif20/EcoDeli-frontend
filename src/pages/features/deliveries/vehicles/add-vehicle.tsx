"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Upload, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useImageUpload } from "@/hooks/use-image-upload"
import React from "react"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { DeliverymanApi, vehicleCategory } from "@/api/deliveryman.api"
import { useNavigate } from "react-router-dom"

const FormSchema = z.object({
  document: z.instanceof(File, { message: "Le document est requis" }),
  documentDescription: z.string().min(1, { message: "La description est requise" }),
  model : z.string().min(1, { message: "Le modèle est requis" }),
  category: z.string().min(1, { message: "La catégorie est requise" }),
  matricule: z.string().min(1, { message: "Le matricule est requis" }),
  electric: z.boolean(),
  co2Consumption: z.string().min(1, { message: "La consommation de CO2 doit être un nombre non négatif" }),
})

export default function AddVehicle() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      document: undefined,
      documentDescription: "",
      category: "",
      matricule: "",
      electric: false,
      co2Consumption: "0",
      model: "",
    },
  })

  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } = useImageUpload({
    onUpload: (url: string) => console.log("URL de l'image téléchargée :", url),
  })

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Véhicules", "Ajouter un Véhicule"],
        links: ["/office/dashboard", "/office/my-vehicles"],
      })
    );
  }, [dispatch]);

  const [categories, setCategories] = useState<vehicleCategory[]>([]);

  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await DeliverymanApi.getVehicleCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };

    fetchCategories();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith("image/")) {
        const fakeEvent = {
          target: {
            files: [file],
            value: "",
          },
          preventDefault: () => {},
          stopPropagation: () => {},
        } as unknown as React.ChangeEvent<HTMLInputElement>
        handleFileChange(fakeEvent)
      }
    },
    [handleFileChange],
  )

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const formData = new FormData();
  
      if (previewUrl) {
        const imageFile = new File([previewUrl], "vehicle_image", { type: "image/jpeg" });
        formData.append("image", imageFile);
        console.log("image", imageFile)
      }

      if (data.document) formData.append("document", data.document)
        console.log('Document file:', data.document);
      formData.append("model", data.matricule)
      formData.append("documentDescription", data.documentDescription);
      formData.append("category", data.category);
      formData.append("registrationNumber", data.matricule);
      formData.append("electric", String(data.electric));
      formData.append("co2Consumption", String(data.co2Consumption));
  
      await DeliverymanApi.addVehicle(formData);
      const navigate = useNavigate();
      navigate("/office/my-vehicles");
    } catch (error) {
      console.error("Erreur lors de l'ajout du véhicule :", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl mx-auto space-y-6 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Ajouter un Véhicule</h2>

        <div>
          <div
            onClick={handleThumbnailClick}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/50 transition-colors hover:bg-muted",
              isDragging && "border-primary border-2",
            )}
          >
            {!previewUrl ? (
              <React.Fragment>
                <div className="rounded-full bg-background p-3 shadow-sm">
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Cliquez pour sélectionner</p>
                  <p className="text-xs text-muted-foreground">ou glissez-déposez un fichier ici</p>
                </div>
              </React.Fragment>
            ) : (
              <div className="relative h-full w-full">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Aperçu"
                  className="object-cover rounded-lg w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={handleThumbnailClick} className="h-9 w-9 p-0">
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleRemove} className="h-9 w-9 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        </div>

        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0] || null)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description du Document</FormLabel>
              <FormControl>
                <Textarea placeholder="Entrez la description du document" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.category_id} value={category.category_id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="matricule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matricule</FormLabel>
              <FormControl>
                <Input placeholder="Entrez le matricule" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matricule</FormLabel>
              <FormControl>
                <Input placeholder="Entrez le modèle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="electric"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Électrique</FormLabel>
                <FormDescription>Cochez si le véhicule est électrique.</FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="co2Consumption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consommation de CO2</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Entrez la consommation de CO2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Soumettre
        </Button>
      </form>
    </Form>
  )
}
