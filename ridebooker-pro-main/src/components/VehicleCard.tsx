import { Users, Luggage, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  name: string;
  category: string;
  seats: number;
  luggage: number;
  pricePerDay: number;
  image: string;
  features: string[];
}

const VehicleCard = ({ name, category, seats, luggage, pricePerDay, image, features }: VehicleCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-card-hover transition-all duration-300 border-border">
      {/* Vehicle Image */}
      <div className="relative h-48 overflow-hidden bg-accent">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>

      <CardContent className="p-6">
        {/* Vehicle Name */}
        <h3 className="text-xl font-semibold mb-3 text-foreground">{name}</h3>

        {/* Vehicle Specs */}
        <div className="flex items-center gap-4 mb-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="text-sm">{seats} Seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Luggage className="h-4 w-4" />
            <span className="text-sm">{luggage} Bags</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="flex items-center gap-1 text-primary">
              <DollarSign className="h-5 w-5" />
              <span className="text-2xl font-bold">{pricePerDay}</span>
            </div>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
          <Button>Book Now</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
