"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Star, Clock } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export interface Service {
  service_id: string
  service_type: string
  status: string
  name: string
  city: string
  price: number
  price_admin: number
  duration_time: number
  available: boolean
  keywords: string[]
  images: string[]
  description: string
  author: {
    id: string
    name: string
    email: string
    photo: string
  }
  rate: number
  comments?: [
    {
      id: string
      author: {
        id: string
        name: string
        photo: string
      }
      content: string
      response?: {
        id: string
        author: {
          id: string
          name: string
          photo: string
        }
        content: string
      }
    },
  ]
}

const fakeServices: Service[] = [
  {
    service_id: "1",
    service_type: "Jardinage",
    status: "Active",
    name: "Entretien de jardin",
    city: "Paris",
    price: 25,
    price_admin: 30,
    duration_time: 60,
    available: true,
    description:
      "Service professionnel d'entretien de jardin. Tonte de pelouse, taille de haies, désherbage et plus encore.",
    keywords: ["jardinage", "entretien", "extérieur"],
    images: [
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    ],
    author: {
      id: "1",
      name: "Rémy T.",
      email: "remy.t@gmail.com",
      photo:
        "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    },
    rate: 4.5,
    comments: [
      {
        id: "1",
        author: {
          id: "2",
          name: "Thomas S.",
          photo:
            "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
        },
        content: "Excellent service, très professionnel et rapide. Je recommande vivement !",
        response: {
          id: "3",
          author: {
            id: "1",
            name: "Rémy T.",
            photo:
              "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
          },
          content: "Merci beaucoup pour votre retour ! C'est un plaisir de vous avoir aidé.",
        },
      },
    ],
  },
  {
    service_id: "2",
    service_type: "Plomberie",
    status: "Active",
    name: "Réparation de tuyauterie",
    city: "Lyon",
    price: 150,
    price_admin: 180,
    duration_time: 90,
    available: true,
    description: "Service professionnel de plomberie pour réparations de tuyaux.",
    keywords: ["plomberie", "réparation", "tuyaux"],
    images: [
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    ],
    author: {
      id: "3",
      name: "Jean Dupont",
      email: "jean.dupont@gmail.com",
      photo:
        "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    },
    rate: 4.2,
    comments: [
      {
        id: "4",
        author: {
          id: "5",
          name: "Marie L.",
          photo:
            "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
        },
        content: "Intervention rapide et efficace. Prix raisonnable.",
        response: {
          id: "6",
          author: {
            id: "3",
            name: "Jean Dupont",
            photo:
              "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
          },
          content: "Merci pour votre confiance !",
        },
      },
    ],
  },
  {
    service_id: "3",
    service_type: "Promenade",
    status: "Active",
    name: "Promenade de chien",
    city: "Marseille",
    price: 15,
    price_admin: 18,
    duration_time: 45,
    available: true,
    description: "Service de promenade pour votre compagnon à quatre pattes.",
    keywords: ["animaux", "chien", "promenade"],
    images: [
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    ],
    author: {
      id: "7",
      name: "Sophie M.",
      email: "sophie.m@gmail.com",
      photo:
        "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    },
    rate: 4.8,
    comments: [
      {
        id: "7",
        author: {
          id: "8",
          name: "Pierre D.",
          photo:
            "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
        },
        content: "Mon chien adore ses promenades avec Sophie ! Service impeccable.",
        response: {
          id: "8",
          author: {
            id: "7",
            name: "Sophie M.",
            photo:
              "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
          },
          content: "C'est toujours un plaisir de promener votre adorable chien !",
        },
      },
    ],
  },
]

export default function ServicesPage() {
  const [services] = useState<Service[]>(fakeServices)
  const [selectedService, setSelectedService] = useState<Service>(services[0])
  const [currentPage, setCurrentPage] = useState(1)
  const servicesPerPage = 3

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Découvrez {services.length} prestations</h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="Recherchez une prestation..." className="pl-10 bg-white" />
          </div>
          <div className="relative flex-1 max-w-md">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="Ville, département, région..." className="pl-10 bg-white" />
          </div>
          <Button className="bg-green-500 hover:bg-green-600">Rechercher</Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm font-medium text-gray-500">Filtrer par:</p>
          <Button variant="outline" size="sm" className="text-xs">
            Les plus récents
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="pr-4 space-y-4">
              {services.map((service) => (
                <Card
                  key={service.service_id}
                  className={`overflow-hidden cursor-pointer transition-all ${
                    selectedService?.service_id === service.service_id ? "border-primary" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="relative h-40 w-full">
                    <img
                      src={service.images[0] || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      {service.rate}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" /> {service.city}
                        </p>
                      </div>
                      <p className="font-bold text-lg">{service.price}€</p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {service.keywords.map((keyword, index) => (
                        <Badge key={index}>
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <Pagination className="mt-4">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
              )}
              {[...Array(Math.ceil(services.length / servicesPerPage))].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {currentPage < Math.ceil(services.length / servicesPerPage) && (
                <PaginationItem>
                  <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>

        <div className="lg:col-span-2 hidden lg:block">
          <Card className="h-full">
            {selectedService ? (
              <div className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedService.name}</h2>
                      <p className="text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {selectedService.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-1">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{selectedService.rate}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{selectedService.duration_time} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedService.keywords.map((keyword, index) => (
                      <Badge key={index}>
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow overflow-auto">
                  <div className="mb-6 flex items-center gap-4 pb-4 border-b">
                    <Avatar className="h-16 w-16 border-2 border-green-100">
                      <AvatarImage src={selectedService.author.photo} />
                      <AvatarFallback>{selectedService.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">Prestation proposée par {selectedService.author.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{selectedService.rate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-gray-700">{selectedService.description}</p>
                    <div className="mt-4 p-4 ">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Prix</p>
                        <p className="font-bold text-xl">{selectedService.price_admin || selectedService.price}€</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-4">Avis des clients</h3>
                    <div className="space-y-4">
                      {selectedService.comments?.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={comment.author.photo} />
                              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{comment.author.name}</p>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                          </div>

                          {comment.response && (
                            <div className="ml-12 mt-3 pt-3 border-t">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.response.author.photo} />
                                  <AvatarFallback>{comment.response.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-sm">{comment.response.author.name}</p>
                                  <p className="text-gray-700 text-sm">{comment.response.content}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t pt-4">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2">
                    Prendre un rendez-vous
                  </Button>
                </CardFooter>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center">
                <div>
                  <p className="text-gray-500 mb-4">Sélectionnez une prestation pour voir les détails.</p>
                  <p className="text-sm text-gray-400">
                    Vous pouvez cliquer sur une des prestations à gauche pour afficher ses informations.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        <Drawer>
          <DrawerTrigger asChild>
            <Button className="lg:hidden fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white">
              Voir les détails
            </Button>
          </DrawerTrigger>
          <DrawerContent  >
            <DrawerHeader className="mx-4">
            <DrawerTitle>{selectedService.name}</DrawerTitle>
            <DrawerDescription>Détails du service</DrawerDescription>
              <div className="flex items-center justify-end mb-1">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-medium">{selectedService.rate}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-3 h-3 mr-1" />
                <span>{selectedService.duration_time} min</span>
              </div>
            </DrawerHeader>
            <div className="mx-4">
                <div className="mb-6 flex items-center gap-4 pb-4 border-b">
                <Avatar className="h-16 w-16 border-2 border-green-100">
                    <AvatarImage src={selectedService.author.photo} />
                    <AvatarFallback>{selectedService.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-lg">Prestation proposée par {selectedService.author.name}</h3>
                    <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>{selectedService.rate}</span>
                    </div>
                </div>
                </div>
                <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700">{selectedService.description}</p>
                <div className="mt-4 p-4 ">
                    <div className="flex justify-between items-center">
                    <p className="font-medium">Prix</p>
                    <p className="font-bold text-xl">{selectedService.price_admin || selectedService.price}€</p>
                    </div>
                </div>
                </div>
            </div>
            <DrawerFooter>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2">
                Prendre un rendez-vous
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Fermer</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}
