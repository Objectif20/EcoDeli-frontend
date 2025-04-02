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

}