import axiosInstance from "./axiosInstance";

export interface Service {
    service_id : string;
    service_type : string;
    status : string;
    name : string; 
    city : string;
    price : number;
    price_admin : number;
    duration_time : number;
    available : boolean;
    keywords : string[];
    images : string[];
}


export class ServiceApi {

    static async getServices(): Promise<Service[]> {
        const response = await axiosInstance.get<Service[]>('/services');
        return response.data;
    }


    static async createService(data: FormData): Promise<Service> {
        const response = await axiosInstance.post<Service>('/client/service', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

}