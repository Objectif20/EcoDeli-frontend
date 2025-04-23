import Meteo from "@/components/features/dashboard/client/meteo";
import { DeliveryDistribution } from "@/components/features/dashboard/deliveryman/package-difference";
import PackageMap from "@/components/features/dashboard/deliveryman/package-map";
import YourPlanning from "@/components/features/dashboard/deliveryman/your-planning";

export default function DeliveryManDashboard() {
    return (
      <div className="w-full p-4">
        <div className="grid grid-cols-6 lg:grid-cols-12 gap-4 w-full">
          <div className="col-span-6 lg:col-span-3 bg-blue-500 rounded-xl">
          <Meteo />          </div>
          <div className="col-span-6 lg:col-span-3 bg-red-500 rounded-xl">
          <Meteo />          </div>
          <div className="col-span-6 lg:col-span-3 bg-yellow-500 rounded-xl">
          <Meteo />          </div>
          <div className="col-span-6 lg:col-span-3 bg-purple-500 rounded-xl">
            <Meteo />
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
          </div>
          </div>
      </div>
    );
  }
  