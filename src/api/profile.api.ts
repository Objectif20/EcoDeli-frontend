import axiosInstance from "./axiosInstance";


export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    color?: EventColor;
    location?: string;
}

export type EventColor =
    | "sky"
    | "amber"
    | "violet"
    | "rose"
    | "emerald"
    | "orange";


export interface GeneralProfile {
    email : string;
    first_name : string;
    last_name : string;
    newsletter : boolean;
}

export interface blockedList {
    photo : string;
    blocked : [
        {
            user_id : string;
            first_name : string;
            last_name : string;
            photo : string;
        }
    ]
}

export interface StripeIntent {
    client_secret: string; 
    id: string;  
    status: string;
}

export interface Availability {
    day_of_week: number;
    morning: boolean;
    morning_start_time: string | null;
    morning_end_time: string | null;
    afternoon: boolean;
    afternoon_start_time: string | null;
    afternoon_end_time: string | null;
    evening: boolean;
    evening_start_time: string | null;
    evening_end_time: string | null;
  }

export class ProfileAPI {
    static async getMyPlanning(): Promise<CalendarEvent[]> {
        const response = await axiosInstance.get<CalendarEvent[]>("/client/planning");
        return response.data;
    }

    static async createReport(message : string) : Promise<void> {
        await axiosInstance.post("/client/profile/report", { report_message : message });
    }

    static async getMyGeneralProfile() : Promise<GeneralProfile> {
        const response = await axiosInstance.get<GeneralProfile>("/client/profile/general-settings");
        return response.data;
    }

    static async updateMyGeneralProfile(data: GeneralProfile) : Promise<void> {
        await axiosInstance.patch("/client/profile/general-settings", data);
    }

    static async updateMyProfileImage(file : File) : Promise<{ url: string }> {
        const formData = new FormData();
        formData.append("image", file);
        const response = await axiosInstance.put("/client/profile/picture", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    static async getAllBlockedUsers(): Promise<blockedList> {
        const response = await axiosInstance.get<blockedList>("/client/profile/blockedList");
        return response.data;
    }

    static async unblockUser(userId: string): Promise<void> {
        await axiosInstance.delete(`/client/profile/blocked/${userId}`);
    }

    static async getStripeAccount() : Promise<{stripeAccountId : string}> {
        const response = await axiosInstance.get<{stripeAccountId : string}>("/client/profile/stripe-account");
        return response.data;
    }

    static async createStripeAccount(accountToken: string): Promise<{ StripeAccountId: string }> {
        const response = await axiosInstance.post<{ StripeAccountId: string }>(
          "/client/profile/create-account",
          {
            accountToken,
          }
        );
        return response.data;
      }

      static async getStripeAccountValidity(): Promise<{
        valid: boolean;
        enabled: boolean;
        needs_id_card: boolean;
        url_complete?: string;
      }> {
        const response = await axiosInstance.get<{
          valid: boolean;
          enabled: boolean;
          needs_id_card: boolean;
          url_complete?: string;
        }>("/client/profile/stripe-validity");
      
        return response.data;
      }

      static async getMyAvailability(): Promise<Availability[]> {
        const response = await axiosInstance.get<Availability[]>("/client/profile/availability");
        return response.data;
      }
      
      static async updateMyAvailability(availabilities: Availability[]): Promise<Availability[]> {
        const response = await axiosInstance.put<Availability[]>("/client/profile/availability", {
          availabilities,
        });
        return response.data;
      }


      static async getMyProfileDocuments() {
        const response = await axiosInstance.get("/client/profile/myDocuments");
        return response.data;
      }

      static async updateMyPassword() {
        const response = await axiosInstance.post("/client/profile/newPassword");
        return response.data;
      }

}
