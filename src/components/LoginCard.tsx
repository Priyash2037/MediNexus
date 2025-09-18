import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, ChevronRight } from "lucide-react";

interface LoginCardProps {
  type: 'patient' | 'doctor';
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
}

export function LoginCard({ type, title, description, buttonText, onClick }: LoginCardProps) {
  const Icon = type === 'patient' ? Users : Stethoscope;
  const variant = type === 'patient' ? 'healthcare' : 'secondary';
  
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 w-fit group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground mt-2 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <Button 
          variant={variant}
          size="lg" 
          className="w-full shadow-lg"
          onClick={onClick}
        >
          {buttonText}
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}