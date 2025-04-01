'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngBoundsExpression } from 'leaflet';
import { DeliveriesAPI, Delivery } from '@/api/deliveries.api';
import { ScrollArea } from '@/components/ui/scroll-area';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import CityAsyncSelectDemo from '@/components/search-place';

export interface City {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

function DeliveriesPage() {
  const franceBounds: LatLngBoundsExpression = useMemo(() => [
    [51.124199, -5.142222],
    [41.333, 9.560016],
  ], []);

  const parisCoordinates = useMemo(() => ({
    latitude: 48.8566,
    longitude: 2.3522,
    radius: 50000
  }), []);

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('around');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [radius, setRadius] = useState(50);

  const fetchDeliveries = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);
    try {
      const coordinates = selectedCity
        ? { latitude: selectedCity.lat, longitude: selectedCity.lon, radius: radius * 1000 }
        : parisCoordinates;

      const response = await DeliveriesAPI.getDeliveries({
        ...coordinates,
        limit: 10,
        page,
      });

      if (response.length > 0) {
        setDeliveries((prevDeliveries) => {
          const newDeliveries = response.filter(
            (newDelivery) =>
              !prevDeliveries.some(
                (prevDelivery) => prevDelivery.shipment_id === newDelivery.shipment_id
              )
          );
          return [...prevDeliveries, ...newDeliveries];
        });
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCity, radius, loading, hasMore]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    console.log(`Selected city in parent: ${city.label}, Lat: ${city.lat}, Lon: ${city.lon}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-grow flex overflow-hidden">
        <div className="p-6 flex flex-col justify-between items-center shadow-md overflow-auto w-full md:w-2/5">
          <div className="w-full mb-4">
            <h2 className="text-xl font-bold mb-4">Trouver un colis sur ma route</h2>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="around" id="around" />
                  <Label htmlFor="around">Autour de</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onRoute" id="onRoute" />
                  <Label htmlFor="onRoute">Sur ma route pour commencer</Label>
                </div>
              </div>
            </RadioGroup>
            {selectedOption === 'around' && (
              <div className="flex flex-col items-start mb-4">
                <CityAsyncSelectDemo onCitySelect={handleCitySelect} labelValue={selectedCity?.label || ''} />
                <div className="mt-4 w-full">
                  <Label>Rayon (km)</Label>
                  <Slider
                    defaultValue={[radius]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setRadius(value[0])}
                  />
                </div>
              </div>
            )}
          </div>

          <ScrollArea className="h-[calc(100vh-20rem)] w-full mb-4">
            <div className="flex w-full flex-col items-center gap-3">
              {deliveries.map((delivery) => (
                <div key={delivery.shipment_id} className="flex items-start w-full mb-4 p-4 border rounded-lg shadow-sm">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{delivery.description}</h3>
                    <p className="">{delivery.departure_city} - {delivery.arrival_city}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                        {delivery.estimated_total_price ?? 'N/A'} €
                      </span>
                      <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                        {delivery.weight}
                      </span>
                      <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                        {delivery.urgent ? 'Urgent' : 'Non urgent'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <InfiniteScroll
                hasMore={hasMore}
                isLoading={loading}
                next={fetchDeliveries}
                threshold={1}
              >
                {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
              </InfiniteScroll>
            </div>
          </ScrollArea>

          <div className="flex justify-center mt-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="bg-primary text-white px-4 py-2 rounded">Plus de filtres</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Filtres</DialogTitle>
                  <DialogDescription>
                    Utilisez cet espace pour ajouter des filtres à vos livraisons.
                  </DialogDescription>
                </DialogHeader>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Filtre 1</AccordionTrigger>
                    <AccordionContent>
                      {/* Contenu du filtre 1 */}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Filtre 2</AccordionTrigger>
                    <AccordionContent>
                      {/* Contenu du filtre 2 */}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="hidden md:block w-3/5 z-0 h-full overflow-hidden">
          <MapContainer bounds={franceBounds} className="w-full h-full" attributionControl={true}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default DeliveriesPage;
