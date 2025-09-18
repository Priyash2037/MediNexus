import { Clock, MessageSquare, Shield, Calendar } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "No travel needed, consult from home"
  },
  {
    icon: MessageSquare,
    title: "Speak in Local Language",
    description: "Doctors available in Hindi & Punjabi"
  },
  {
    icon: Calendar,
    title: "24/7 Access",
    description: "Healthcare available anytime, anywhere"
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your health data is completely protected"
  }
];

export function Benefits() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Us
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Healthcare made simple for rural communities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-background to-muted/50 border border-border shadow-card hover:shadow-xl transition-all duration-300 group hover:scale-105">
              <div className="mx-auto mb-6 p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/10 w-fit group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}