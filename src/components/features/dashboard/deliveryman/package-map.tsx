import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import PackageIcon from "@/assets/illustrations/package.svg"


export default function PackageMap() {
  useEffect(() => {
    const map = L.map("map", {
      center: [48.8566, 2.3522], 
      zoom: 12, 
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    }).addTo(map)

    const points = []
    for (let i = 0; i < 15; i++) {
      const lat = 48.8566 + (Math.random() - 0.5) * 0.1 
      const lon = 2.3522 + (Math.random() - 0.5) * 0.1 
      points.push([lat, lon])
    }

    points.forEach((point) => {
      const marker = L.marker(point as L.LatLngTuple, {
        icon: L.icon({
          iconUrl: PackageIcon,
          iconSize: [32, 32], 
          iconAnchor: [16, 32], 
          popupAnchor: [0, -32],
        }),
      }).addTo(map)
      
      marker.bindPopup("Colis 1")
    })
  }, [])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Colis à proximité de votre position</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full">
        <div id="map" className="w-full h-96"></div>
      </CardContent>
    </Card>
  )
}
