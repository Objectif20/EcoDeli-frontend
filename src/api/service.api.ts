import axiosInstance from "./axiosInstance";
import { Availability } from "./profile.api";

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


  export interface providerDisponibilities {
    availabilities : [Availability],
    appointments : [
       {
        date : string,
        time : string,
        end : string
       }
    ]
  }    


export class ServiceApi {

    static async getServices(
        page: number = 1,
        limit: number = 3,
        search?: string,
        city?: string
      ): Promise<{ data: Service[]; total: number }> {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));
        if (search) params.append('search', search);
        if (city) params.append('city', city);
      
        const response = await axiosInstance.get(`/client/service?${params.toString()}`);
        return response.data
      }

    static async createService(data: FormData): Promise<Service> {
        const response = await axiosInstance.post<Service>('/client/service', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    static async getMyServices(total : number, page : number) {
            const response = await axiosInstance.get(`/client/service/me?total=${total}&page=${page}`);
            return response;
    }

    static async getProviderDisponibilites(service_id : string) : Promise<providerDisponibilities> {
        const response = await axiosInstance.get(`/client/service/${service_id}/providerDisponibility`);
        return response.data;
    } 

    static async addAppointment(service_id : string, date : Date) {
        const response = await axiosInstance.post(`/client/service/${service_id}/appointments`, {
            service_date: date,
        });
        return response;
    }

    static async getServiceDetails(service_id: string): Promise<Service> {
        const response = await axiosInstance.get<Service>(`/client/service/${service_id}`);
        return response.data;
    }

    static async getProviderReviews(limit : number, page : number) {
        const response = await axiosInstance.get(`/client/service/reviews?limit=${limit}&page=${page}`);
        return response.data;
    }

    static async reponseToReview(review_id : string, content : string) {
        const response = await axiosInstance.post(`/client/service/reviews/${review_id}/reply`, {
            content: content,
        });
        return response;
    }


}