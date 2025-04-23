import Meteo from "@/components/features/dashboard/client/meteo";
import YourPlanning from "@/components/features/dashboard/deliveryman/your-planning";
import { BillingProvider } from "@/components/features/dashboard/provider/billing";
import NextServicesProvider from "@/components/features/dashboard/provider/next-services";

export default function ProviderDashboard() {
    return (
      <div className="w-full p-4">
        <div className="grid grid-cols-6 lg:grid-cols-12 gap-4 w-full">
          <div className="col-span-6 lg:col-span-3 bg-blue-500 rounded-xl">
            <Meteo />
          </div>
          <div className="col-span-6 lg:col-span-3 bg-red-500 rounded-xl">
            <Meteo />
          </div>
          <div className="col-span-6 lg:col-span-3 bg-yellow-500 rounded-xl">
            <Meteo />
          </div>
          <div className="col-span-6 lg:col-span-3 bg-purple-500 rounded-xl">
            <Meteo />
          </div>

  
          <div className="col-span-6 lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
                <div className="bg-orange-500 rounded-xl">
                <YourPlanning />
                </div>
                <div className="bg-green-500 rounded-xl">
                <BillingProvider />
                </div>
            </div>

            <div className="bg-teal-500 rounded-xl h-full">
                <NextServicesProvider />
            </div>
            </div>
        </div>
      </div>
    );
  }
  