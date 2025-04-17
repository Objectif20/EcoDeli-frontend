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
}
