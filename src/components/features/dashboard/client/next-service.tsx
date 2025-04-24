"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export default function NextService() {
  const navigate = useNavigate()

  const hasNextService = true

  const nextService = {
    title: "Promenade de votre chien",
    date: "Sam 12 janvier 2025, 14h30",
    image: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  }

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-base font-medium">Prochaine prestation</CardTitle>
      </CardHeader>

      {hasNextService ? (
        <>
          <CardContent className="flex flex-col items-center gap-2">
            <div className="w-full overflow-hidden rounded-lg">
              <img
                src={nextService.image}
                alt="Photo prestation"
                width={300}
                height={400}
                className="w-full object-cover rounded-md"
              />
            </div>
            <div className="text-sm text-center">
              <p className="font-medium">{nextService.title}</p>
              <p className="text-muted-foreground text-xs">{nextService.date}</p>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/office/planning")}>
              Accéder au planning
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardContent>
            <p className="text-sm text-muted-foreground">Aucune prestation prévue.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/services")}>
              Découvrir les prestations
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
