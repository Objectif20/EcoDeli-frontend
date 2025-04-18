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

    static async updateMyProfileImage(file : File) : Promise<void> {
        const formData = new FormData();
        formData.append("image", file);
        await axiosInstance.post("/client/profile/photo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    static async getAllBlockedUsers(): Promise<blockedList> {
        const response = await axiosInstance.get<blockedList>("/client/profile/blockedList");
        return response.data;
    }

    static async unblockUser(userId: string): Promise<void> {
        await axiosInstance.delete(`/client/profile/blocked/${userId}`);
    }
}
