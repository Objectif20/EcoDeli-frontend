import Meteo from "@/components/features/dashboard/client/meteo";
import CompletedDeliveries from "@/components/features/dashboard/deliveryman/completed-deliveries";
import NearDeliveries from "@/components/features/dashboard/deliveryman/deliveries-near";
import NextDelivery from "@/components/features/dashboard/deliveryman/next-deliveries";
import { DeliveryDistribution } from "@/components/features/dashboard/deliveryman/package-difference";
import PackageMap from "@/components/features/dashboard/deliveryman/package-map";
import YourPlanning from "@/components/features/dashboard/deliveryman/your-planning";
import CurrentBalance from "@/components/features/dashboard/provider/current-balance";

export default function DeliveryManDashboard() {
    return (
      <div className="w-full p-4">
        <h1 className="text-2xl font-bold mb-6">Bienvenue sur votre espace transporteur, Frédéric</h1>

        <div className="grid grid-cols-6 lg:grid-cols-12 gap-4 w-full">
          <div className="col-span-6 lg:col-span-3 bg-blue-500 rounded-xl">
          <CurrentBalance />          </div>
          <div className="col-span-6 lg:col-span-3 bg-red-500 rounded-xl">
          <Meteo />          </div>
          <div className="col-span-6 lg:col-span-3 bg-yellow-500 rounded-xl">
          <CompletedDeliveries />          </div>
          <div className="col-span-6 lg:col-span-3 bg-purple-500 rounded-xl">
            <NearDeliveries />
          </div>
  
          <div className="col-span-6 lg:col-span-4 bg-pink-500 rounded-xl">
            <DeliveryDistribution />
          </div>
          <div className="col-span-6 lg:col-span-8 bg-indigo-500 rounded-xl">
            <PackageMap />
          </div>
  
          <div className="col-span-6 lg:col-span-4 bg-orange-500 rounded-xl">
          <YourPlanning />
          </div>
          <div className="col-span-6 lg:col-span-8 bg-teal-500 rounded-xl">
            <NextDelivery />
          </div>
          </div>
      </div>
    );
  }
  