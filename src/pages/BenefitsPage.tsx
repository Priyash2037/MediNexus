import { Benefits } from "@/components/Benefits";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BenefitsPage() {
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
            Why Choose रुरल केयर
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the advantages of our telemedicine platform designed specifically for rural communities.
          </p>
        </div>
      </div>
      
      <Benefits />
      
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-card to-muted/50 p-8 rounded-3xl border border-border shadow-card">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Experience the Difference
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our platform is built with rural communities in mind, ensuring healthcare is accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="healthcare" 
              size="lg" 
              onClick={() => navigate('/')}
            >
              Get Started Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}