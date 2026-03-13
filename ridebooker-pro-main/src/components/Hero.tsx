import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="City transportation" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Book Your Perfect Ride
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            From compact sedans to luxury buses - find the perfect vehicle for your journey. 
            Easy booking, great prices, and reliable service.
          </p>

          {/* Quick Booking Card */}
          <Card className="p-6 bg-card/95 backdrop-blur-sm shadow-card-hover border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <MapPin className="text-primary h-5 w-5" />
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground block mb-1">Pick-up Location</label>
                  <input 
                    type="text" 
                    placeholder="Enter location"
                    className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <Calendar className="text-primary h-5 w-5" />
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground block mb-1">Pick-up Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-transparent border-none outline-none text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <Users className="text-primary h-5 w-5" />
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground block mb-1">Passengers</label>
                  <select className="w-full bg-transparent border-none outline-none text-sm text-foreground">
                    <option value="1-4">1-4 people</option>
                    <option value="5-7">5-7 people</option>
                    <option value="8-10">8-10 people</option>
                    <option value="10+">10+ people</option>
                  </select>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full md:w-auto">
              Search Vehicles
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
