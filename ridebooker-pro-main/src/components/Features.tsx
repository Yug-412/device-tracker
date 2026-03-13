import { Shield, Clock, Wallet, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "All vehicles are regularly maintained and fully insured for your safety.",
  },
  {
    icon: Clock,
    title: "24/7 Service",
    description: "Book anytime, anywhere with our round-the-clock booking system.",
  },
  {
    icon: Wallet,
    title: "Best Prices",
    description: "Competitive rates with no hidden fees. What you see is what you pay.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Our dedicated team is always ready to help with your bookings.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-accent/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide reliable, comfortable, and affordable transportation solutions for all your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
