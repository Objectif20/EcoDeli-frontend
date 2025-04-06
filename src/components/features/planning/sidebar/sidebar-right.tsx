import * as React from "react";
import { Calendars } from "@/components/features/planning/sidebar/calendars";
import { DatePicker } from "@/components/features/planning/sidebar/date-picker";
import { Sidebar, SidebarContent, SidebarSeparator } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface SidebarRightProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange: (newDate: Date | undefined) => void;
  onMonthChange: (newMonth: Date | undefined) => void;
  onCalendarsChange?: (calendars: string[]) => void;
}

export function SidebarRight({ onDateChange, onMonthChange, onCalendarsChange, ...props }: SidebarRightProps) {
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile.includes('PROVIDER');
  const isClient = user?.profile.includes('CLIENT');
  const isMerchant = user?.profile.includes('MERCHANT');
  const isDeliveryman = user?.profile.includes('DELIVERYMAN');

  const data: { calendars: { name: string; items: string[] }[] } = {
    calendars: [
      {
        name: "Mes différents calendriers",
        items: [],
      },
    ],
  };

  
  if (isProvider) {
    data.calendars[0].items.push("Calendrier prestataire");
  }
  if (isClient) {
    data.calendars[0].items.push("Calendrier expéditeur");
  }
  if (isMerchant) {
    data.calendars[0].items.push("Calendrier commerçant");
  }
  if (isDeliveryman) {
    data.calendars[0].items.push("Calendrier transporteur");
  }

  const handleSelectionChange = (selectedItems: string[]) => {
    onCalendarsChange?.(selectedItems);
  };

  return (
    <Sidebar collapsible="none" className="sticky top-0 border-l rounded-lg h-96" {...props}>
      <SidebarContent>
        <DatePicker onDateChange={onDateChange} onMonthChange={onMonthChange} />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} onSelectionChange={handleSelectionChange} />
      </SidebarContent>
    </Sidebar>
  );
}
