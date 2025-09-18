import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, ArrowLeft, AlertCircle, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
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
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contact & Support
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're here to help you access quality healthcare. Reach out to us anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* 24/7 Helpline */}
          <Card className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-2 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary to-accent w-fit">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">24/7 Helpline</CardTitle>
              <CardDescription className="text-lg">Always available for support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">1800-RURAL-CARE</div>
              <div className="text-lg font-semibold text-foreground mb-2">1800-787-252-2273</div>
              <p className="text-muted-foreground">Free calling from any mobile or landline</p>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card className="text-center p-6 bg-gradient-to-br from-secondary/10 to-primary/5 border-2 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-secondary to-secondary-hover w-fit">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Email Support</CardTitle>
              <CardDescription className="text-lg">Get detailed assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-foreground mb-2">help@ruralcare.in</div>
              <p className="text-muted-foreground mb-4">Response within 2 hours</p>
              <Button variant="secondary" size="sm" className="mt-2">
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* Office Location */}
          <Card className="text-center p-6 bg-gradient-to-br from-accent/10 to-secondary/5 border-2 hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-accent to-primary w-fit">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Our Office</CardTitle>
              <CardDescription className="text-lg">Visit us in person</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-foreground mb-4">
                <div className="font-semibold">रुरल केयर Healthcare</div>
                <div>Tech City, Sector 5</div>
                <div>Chandigarh, Punjab 160036</div>
              </div>
              <Button variant="outline" size="sm">
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Operating Hours */}
        <Card className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-card to-muted/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-2xl bg-gradient-to-br from-secondary to-accent w-fit">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Support Hours</CardTitle>
            <CardDescription className="text-lg">When you can reach us</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 text-center">
              <div className="p-6 rounded-2xl bg-background border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Phone Support</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div>Emergency: <span className="font-semibold text-primary">24/7 Available</span></div>
                  <div>General Support: <span className="font-semibold text-foreground">6 AM - 10 PM</span></div>
                  <div>Technical Help: <span className="font-semibold text-foreground">8 AM - 8 PM</span></div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-background border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Online Support</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div>Live Chat: <span className="font-semibold text-primary">24/7 Available</span></div>
                  <div>Email Response: <span className="font-semibold text-foreground">Within 2 hours</span></div>
                  <div>Video Support: <span className="font-semibold text-foreground">9 AM - 6 PM</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Notice */}
        <Card className="max-w-4xl mx-auto mb-8 border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">Important Emergency Notice</h3>
                <p className="text-amber-700 leading-relaxed">
                  This telemedicine service is not designed for medical emergencies. For immediate medical attention, 
                  please visit your nearest hospital emergency room or call emergency services at <strong>108</strong> or <strong>102</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">Ready to Get Healthcare?</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="healthcare" 
              size="lg" 
              onClick={() => navigate('/')}
              className="shadow-lg"
            >
              Start Consultation
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => navigate('/how-it-works')}
            >
              Learn How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}