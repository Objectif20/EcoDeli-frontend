"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { ChevronLeft, EllipsisVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { DeleteConversationDialog } from "./delete-conversation-dialog";
import { BlockUserDialog } from "./block-user-dialog";
import DeliveryNegotiateDialog from "@/pages/features/messaging/delivery-negociate";
import { Contact } from "@/hooks/use-chat";
import { RootState } from "@/redux/store";
import { DeliveriesAPI } from "@/api/deliveries.api";
import { DeliverymanApi } from "@/api/deliveryman.api";


interface ChatHeaderProps {
  contactInfo?: Contact;
  onBackClick: () => void;
  userId: string;
}

export const ChatHeader = ({ contactInfo, onBackClick, userId }: ChatHeaderProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [showNegotiate, setShowNegotiate] = useState(false);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!user) return;

      const isClientOrMerchant = user.profile.includes("CLIENT") || user.profile.includes("MERCHANT");
      if (!isClientOrMerchant) return;

      try {
        const deliveries = await DeliveriesAPI.getMyCurrentShipments();
        if (deliveries.length === 0) return;

        const isEligible = await DeliverymanApi.isDeliverymanElligibleToTakeDeliveries(userId);
        if (isEligible) {
          setShowNegotiate(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des conditions :", error);
      }
    };

    checkEligibility();
  }, [user, userId]);

  return (
    <div className="flex items-center p-4 border-b border-border bg-background/95 sticky top-0 z-10">
      {typeof window !== "undefined" && window.innerWidth <= 768 && (
        <Button onClick={onBackClick} className="mr-2" variant="ghost" size="icon">
          <ChevronLeft className="size-4" />
        </Button>
      )}
      <Avatar>
        <AvatarImage src={contactInfo?.photo || "/placeholder.svg"} alt={contactInfo?.first_name} />
        <AvatarFallback>{contactInfo?.first_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-3 flex-1">
        <h1 className="text-lg font-semibold">
          {contactInfo?.first_name} {contactInfo?.last_name}
        </h1>
      </div>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="icon">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {showNegotiate && <DeliveryNegotiateDialog deliveryman_user_id={userId || ""} />}
            <DeleteConversationDialog userId={userId} />
            <BlockUserDialog userId={userId} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
