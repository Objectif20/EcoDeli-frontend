"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L, { type LatLngBoundsExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import { User, Mail, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { DeliveriesAPI, type DeliveriesLocation } from "@/api/deliveries.api"

const createCustomIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background: hsl(var(--primary));
        border-radius: 50% 50% 50% 0;
        width: 32px;
        height: 32px;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style="transform: rotate(45deg);"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

const DeliveriesLocationPage = () => {
  const { t } = useTranslation()
  const [deliveries, setDeliveries] = useState<DeliveriesLocation[]>([])
  const [_, setSelectedDelivery] = useState<DeliveriesLocation | null>(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("client.pages.office.delivery.deliveriesLocation.breadcrumb.home"),
          t("client.pages.office.delivery.deliveriesLocation.breadcrumb.deliveries"),
          t("client.pages.office.delivery.deliveriesLocation.breadcrumb.location"),
        ],
        links: ["/office/dashboard"],
      }),
    )

    const fetchDeliveries = async () => {
      try {
        const data = await DeliveriesAPI.getMyDeliveriesLocation()
        setDeliveries(data)
      } catch (error) {
        console.error("Error fetching deliveries location:", error)
      }
    }

    fetchDeliveries()
  }, [dispatch, t])

  const handleMarkerClick = (delivery: DeliveriesLocation) => {
    setSelectedDelivery(delivery)
  }

  const franceBounds: LatLngBoundsExpression = [
    [41.36, -5.14],
    [51.09, 9.56],
  ]

  const customIcon = createCustomIcon()

  return (
    <div className="w-full h-full z-0">
      <MapContainer bounds={franceBounds} className="w-full h-full z-0" attributionControl={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {deliveries.map((delivery) => (
          <Marker
            key={delivery.id}
            position={[delivery.coordinates.lat, delivery.coordinates.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(delivery),
            }}
          >
            <Popup className="custom-popup" maxWidth={320} minWidth={280}>
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium leading-tight">{t("client.pages.office.delivery.deliveriesLocation.breadcrumb.deliveries")}</CardTitle>
                </CardHeader>

                {delivery.deliveryman && (
                  <>
                    <Separator />
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-border">
                          <AvatarImage
                            src={delivery.deliveryman.photo || "/placeholder.svg"}
                            alt={delivery.deliveryman.name}
                          />
                          <AvatarFallback className="text-xs">
                            {delivery.deliveryman.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {t("client.pages.office.delivery.deliveriesLocation.deliveryman")}
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="font-medium truncate">{delivery.deliveryman.name}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{delivery.deliveryman.email}</span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => navigate(`/office/deliveries/public/${delivery.id}`)}
                          >
                            <Eye className="h-3 w-3 mr-2" />
                            {t("client.pages.office.delivery.deliveriesLocation.accessDetails")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  )
}

export default DeliveriesLocationPage
