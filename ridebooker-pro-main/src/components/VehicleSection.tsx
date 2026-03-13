import VehicleCard from "./VehicleCard";
import sedan4 from "@/assets/sedan-4-seater.jpg";
import suv5 from "@/assets/suv-5-seater.jpg";
import minivan7 from "@/assets/minivan-7-seater.jpg";
import van10 from "@/assets/van-10-seater.jpg";
import bus50 from "@/assets/bus-50-seater.jpg";

const vehicles = [
  {
    name: "Luxury Sedan",
    category: "4-Seater",
    seats: 4,
    luggage: 2,
    pricePerDay: 49,
    image: sedan4,
    features: ["AC", "Automatic", "Bluetooth"],
  },
  {
    name: "Family SUV",
    category: "5-Seater",
    seats: 5,
    luggage: 4,
    pricePerDay: 69,
    image: suv5,
    features: ["AC", "Automatic", "GPS", "Bluetooth"],
  },
  {
    name: "Spacious Minivan",
    category: "7-Seater",
    seats: 7,
    luggage: 5,
    pricePerDay: 89,
    image: minivan7,
    features: ["AC", "Automatic", "GPS", "Extra Space"],
  },
  {
    name: "Passenger Van",
    category: "10-Seater",
    seats: 10,
    luggage: 8,
    pricePerDay: 129,
    image: van10,
    features: ["AC", "Comfortable", "GPS", "USB Ports"],
  },
  {
    name: "Luxury Charter Bus",
    category: "50-Seater",
    seats: 50,
    luggage: 30,
    pricePerDay: 399,
    image: bus50,
    features: ["AC", "Reclining Seats", "WiFi", "Entertainment"],
  },
];

const VehicleSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Choose Your Vehicle
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select from our wide range of vehicles to suit your travel needs. 
            All vehicles are well-maintained and regularly serviced.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <VehicleCard key={index} {...vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleSection;
