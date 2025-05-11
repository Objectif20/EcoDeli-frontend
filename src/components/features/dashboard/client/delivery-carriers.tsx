"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

type Carrier = {
  id: string
  name: string
  rating: number
  status: "going" | "stop" | "finished"
  avatar: string
}

export default function DeliveryCarriers() {
  const carriers: Carrier[] = [
    {
      id: "1",
      name: "Nathalie P.",
      rating: 5,
      status: "going",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Rémy T.",
      rating: 3,
      status: "stop",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Quentin D.",
      rating: 4,
      status: "finished",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const getStatusBadge = (status: Carrier["status"]) => {
    switch (status) {
      case "going":
        return <Badge className="bg-green-500 hover:bg-green-600">going</Badge>
      case "stop":
        return <Badge className="bg-orange-500 hover:bg-orange-600">stop</Badge>
      case "finished":
        return <Badge className="bg-blue-500 hover:bg-blue-600">finished</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader >
        <CardTitle className="text-base font-medium">Les transporteurs de vos colis</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {carriers.map((carrier) => (
            <div key={carrier.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={carrier.avatar || "/placeholder.svg"} alt={carrier.name} />
                  <AvatarFallback>{carrier.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{carrier.name}</p>
                  {renderStars(carrier.rating)}
                </div>
              </div>
              {getStatusBadge(carrier.status)}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" className="text-xs text-primary flex items-center gap-1">
            Voir l'historique des livraisons
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
