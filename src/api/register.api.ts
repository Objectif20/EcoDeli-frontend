import axiosInstance from "./axiosInstance";

export interface Plan {
    plan_id: number;
    name: string;
    price: string;
    priority_shipping_percentage: string;
    priority_months_offered: number;
    max_insurance_coverage: string;
    extra_insurance_price: string;
    shipping_discount: string;
    permanent_discount: string;
    permanent_discount_percentage: string;
    small_package_permanent_discount: string;
    first_shipping_free: boolean;
    first_shipping_free_threshold: string;
    is_pro: boolean;
}

export interface Language {
    language_id: string;
    language_name: string;
    iso_code: string;
    active: boolean;
}

export class RegisterApi {
    static async getPlan(): Promise<Plan[]> {
        try {
            const response = await axiosInstance.get("/client/register/plan");
            return response.data;
        } catch (error) {
            console.error("Error fetching plans:", error);
            return [];
        }
    }

    static async getLanguage(): Promise<Language[]> {
        try {
            const response = await axiosInstance.get("/client/register/language");
            return response.data;
        } catch (error) {
            console.error("Error fetching languages:", error);
            return [];
        }
    }

    static async registerClient(data: any): Promise<any> {
        try {
            const response = await axiosInstance.post("/client/register/client", data);
            return response.data;
        } catch (error) {
            console.error("Error registering client:", error);
            throw error;
        }
    }

    static async registerPrestataire(data: any): Promise<any> {
        const formData = new FormData();
        

        if (data.documents && Array.isArray(data.documents)) {
            data.documents.forEach((doc: { file: File, name: string, id: string }) => {
                formData.append('documents', doc.file);
            });
        }
        
        for (const key in data) {
            if (data.hasOwnProperty(key) && key !== 'documents') {
                formData.append(key, data[key]);
            }
        }
        
        formData.set("newsletter", data.newsletter ? "true" : "false");
        
        try {
            const response = await axiosInstance.post("/client/register/provider", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error registering prestataire:", error);
            throw error;
        }
    }

    static async registerCommercant(data: any): Promise<any> {
        try {
            const response = await axiosInstance.post("/client/register/merchant", data);
            return response.data;
        } catch (error) {
            console.error("Error registering commercant:", error);
            throw error;
        }
    }

    static async registerDeliveryPerson(data: FormData): Promise<any> {
        try {
            const response = await axiosInstance.post("/client/register/deliveryman", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error registering delivery person:", error);
            throw new Error("Failed to register delivery person");
        }
    }

    static async isEmailAvailable(email: string): Promise<boolean> {
        try {
            const response = await axiosInstance.get(`/client/register/email?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (error) {
            console.error("Error checking email availability:", error);
            throw error;
        }
    }

    static async isSiretAvailable(siret: string): Promise<boolean> {    
        try {
            const response = await axiosInstance.get(`/client/register/siret?siret=${encodeURIComponent(siret)}`);
            return response.data;
        } catch (error) {
            console.error("Error checking SIRET availability:", error);
            throw error;
        }
    }

    static async isDeliveryPersonEmailAvailable(email: string): Promise<boolean> {
        try {
            const response = await axiosInstance.get(`/client/register/emailDelivery?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (error) {
            console.error("Error checking delivery person email availability:", error);
            throw error;
        }
    }
}
