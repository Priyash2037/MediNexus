import { HowItWorks } from "@/components/HowItWorks";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How Our Platform Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Getting healthcare has never been easier. Follow these simple steps to connect with qualified doctors.
          </p>
        </div>
      </div>
      
      <HowItWorks />
      
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of patients already using our platform for convenient healthcare access.
          </p>
          <Button 
            variant="healthcare" 
            size="lg" 
            onClick={() => navigate('/')}
            className="shadow-lg"
          >
            Start Your Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}