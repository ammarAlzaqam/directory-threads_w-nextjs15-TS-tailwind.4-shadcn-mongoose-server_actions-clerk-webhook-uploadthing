import { FerrisWheel, LoaderPinwheel, LucideShipWheel, ShipWheel } from "lucide-react";

export default function Loading() {
  return (
    <section className="flex justify-center items-center min-h-screen">
      <LoaderPinwheel size={50} className="animate-spin" />
    </section>
  );
}
