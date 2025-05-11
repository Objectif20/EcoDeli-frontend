"use client"

import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const upcomingServices = [
  {
    id: "1",
    client: {
      name: "Nathalie P.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "NP",
    },
    service: "Promenade de votre chien",
    date: "12/03/2025",
  },
  {
    id: "2",
    client: {
      name: "Thomas R.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TR",
    },
    service: "Livraison de colis",
    date: "14/03/2025",
  },
  {
    id: "3",
    client: {
      name: "Sophie M.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    service: "Courses alimentaires",
    date: "15/03/2025",
  },
  {
    id: "4",
    client: {
      name: "Jean D.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    service: "Promenade de votre chien",
    date: "18/03/2025",
  },
  {
    id: "5",
    client: {
      name: "Marie L.",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ML",
    },
    service: "Livraison de repas",
    date: "20/03/2025",
  },
]

export default function NextServicesProvider() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Prochaines prestations à réaliser
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          {upcomingServices.map((service) => (
            <div key={service.id} className="flex items-center gap-3 pb-3 border-b last:border-0">
              <Avatar>
                <AvatarImage src={service.client.avatar || "/placeholder.svg"} alt={service.client.name} />
                <AvatarFallback>{service.client.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{service.client.name}</p>
                <p className="text-sm text-muted-foreground truncate">{service.service}</p>
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">{service.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
