import axiosInstance from "./axiosInstance";

interface Location {
    type: string;
    coordinates: [number, number];
}

export interface Delivery {
    shipment_id: string;
    description: string;
    estimated_total_price: number | null;
    proposed_delivery_price: number | null;
    weight: string;
    volume: string;
    deadline_date: string | null;
    time_slot: string | null;
    urgent: boolean;
    status: string | null;
    image: string | null;
    views: number;
    departure_city: string;
    arrival_city: string;
    departure_location: Location;
    arrival_location: Location;
}

export interface DeliveriesFilter {
    latitude: number;
    longitude: number;
    radius: number;
    limit?: number;
    page?: number;
    routeStartLatitude?: number;
    routeStartLongitude?: number;
    routeEndLatitude?: number;
    routeEndLongitude?: number;
    routeRadius?: number;
    minPrice?: number;
    maxPrice?: number;
    minWeight?: number;
    maxWeight?: number;
    deliveryType?: string;
}

// Interface pour le détail d'une annonce de livraison

export interface DeliveryDetails {
    id: string;
    name: string;
    description: string;
    complementary_info: string;
    departure: CityLocation;
    arrival: CityLocation;
    departure_date: string;
    arrival_date: string;
    status: string;
    initial_price: number;
    price_with_step: PriceStep[];
    invoice: Invoice[];
  }
  
  export interface CityLocation {
    city: string;
    coordinates: [number, number];
  }
  
  export interface PriceStep {
    step: string;
    price: number;
  }
  
  export interface Invoice {
    name: string;
    url_invoice: string;
  }
  
  export interface Package {
    id: string;
    picture: string[];
    name: string;
    fragility: boolean;
    estimated_price: number;
    weight: number;
    volume: number;
  }
  
  export interface Step {
    id: number;
    title: string;
    description: string;
    date: string;
    departure: CityLocation;
    arrival: CityLocation;
    courier: Courier;
  }
  
  export interface Courier {
    name: string;
    photoUrl: string;
  }
  
  export interface Shipment {
    details: DeliveryDetails;
    package: Package[];
    steps: Step[];
  }


export class DeliveriesAPI {

    static async getDeliveries(apiFilter : DeliveriesFilter) : Promise<Delivery[]> {
            try{
                const response = await axiosInstance.get<Delivery[]>("/client/shipments", {
                    params: apiFilter
                });
                return response.data;
            } catch (error) {
                console.error("Error fetching deliveries:", error);
                throw new Error("Failed to fetch deliveries");
            }
    }

    static async createShipment(data: FormData): Promise<any> {
        try {
            const response = await axiosInstance.post("/client/shipments", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating shipment:", error);
            throw new Error("Failed to create shipment");
        }
    }


    static async getShipmentDetailsById(shipment_id : string) : Promise<Shipment> {

        try {
            const response = await axiosInstance.get<Shipment>(`/client/shipments/${shipment_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching shipment details:", error);
            throw new Error("Failed to fetch shipment details");
        }
    }

}