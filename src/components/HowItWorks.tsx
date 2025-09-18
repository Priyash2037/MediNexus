import { UserPlus, UserCheck, Video, FileText } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Sign up with your phone number in seconds"
  },
  {
    icon: UserCheck,
    title: "Choose Doctor", 
    description: "Select from verified healthcare professionals"
  },
  {
    icon: Video,
    title: "Video Consult",
    description: "Connect instantly through secure video call"
  },
  {
    icon: FileText,
    title: "Get Prescription",
    description: "Receive digital prescription and medical advice"
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get healthcare in 4 simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}