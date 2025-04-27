import axiosInstance from "./axiosInstance";

export interface Route {
    id: string;
    from: string;
    to: string;
    permanent: boolean;
    coordinates: {
      origin: [number, number];
      destination: [number, number];
    };
    date?: string;
    weekday?: string;
    tolerate_radius: number;
    comeback_today_or_tomorrow: "today" | "tomorrow" | "later";
  }

  export interface RoutePostDto {
    from: string;
    to: string;
    permanent: boolean;
    date?: string;
    weekday?: string;
    tolerate_radius: number;
    comeback_today_or_tomorrow: "today" | "tomorrow" | "later";
  }


export class DeliverymanApi {

    static async getDeliverymanRoutes() : Promise<Route[]> {
        const response = await axiosInstance.get<Route[]>('/client/deliveryman/trips');
        return response.data;
    }

    static async addDeliverymanRoute(route: RoutePostDto) : Promise<Route> {
        const response = await axiosInstance.post<Route>('/client/deliveryman/trips', route);
        return response.data;
    }

}