import { Button } from "@/components/ui/button";
import { LoginCard } from "@/components/LoginCard";
import { Phone, Heart, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TelemedicineLanding() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-primary/5 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              {t('landing.hero.title')}{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-8 leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto">
              Connect with qualified doctors instantly through secure video consultations. 
              No need to travel - get expert medical care from the comfort of your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="healthcare" size="xl" className="shadow-hero">
                {t('dashboard.book_appointment')}
              </Button>
              <Button variant="outline" size="xl">
                {t('nav.how_it_works')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Login Cards */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your path to better healthcare
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <LoginCard
              type="patient"
              title="I am a Patient"
              description="Easy registration with just your phone number. Get instant access to qualified doctors."
              buttonText="Register as Patient"
            />
            <LoginCard
              type="doctor"
              title="I am a Doctor"
              description="Professional login for verified healthcare providers. Join our network of trusted doctors."
              buttonText="Doctor Login"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of patients and doctors already using our platform for better healthcare access
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="healthcare" size="xl" className="shadow-hero min-w-[280px]">
              Consult a Doctor Now
            </Button>
            <Button variant="secondary" size="xl" className="min-w-[280px]">
              Doctors - Join Our Network
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">रुरल केयर</span>
            </div>
            
            {/* Helpline */}
            <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-gradient-to-r from-secondary/20 to-primary/10 rounded-2xl border border-border max-w-md mx-auto">
              <Phone className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div className="text-sm text-muted-foreground">24/7 Helpline</div>
                <div className="text-lg font-semibold text-foreground">1800-RURAL-CARE</div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl max-w-2xl mx-auto">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div className="text-left">
                <div className="font-semibold text-amber-800 mb-1">Important Notice</div>
                <div className="text-sm text-amber-700">
                  This service is not for medical emergencies. For immediate medical attention, 
                  please visit your nearest hospital or call emergency services (108).
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
            <p>© 2024 रुरल केयर. All rights reserved. Connecting rural communities with quality healthcare.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}