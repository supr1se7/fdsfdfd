import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PlanCardProps {
  type: "tickets" | "sales" | "moderation";
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: React.ReactNode;
  isPopular?: boolean;
  onSelect: (planType: string) => void;
}

export function PlanCard({ 
  type, 
  title, 
  description, 
  price, 
  features, 
  icon, 
  isPopular = false,
  onSelect 
}: PlanCardProps) {
  const gradients = {
    tickets: "from-blue-500 to-purple-600",
    sales: "from-red-500 to-neon-red",
    moderation: "from-green-500 to-teal-600",
  };

  const borderColors = {
    tickets: "border-blue-500/30 hover:border-blue-500/60",
    sales: "border-neon-red hover:border-neon-red",
    moderation: "border-green-500/30 hover:border-green-500/60",
  };

  return (
    <Card className={`
      bg-dark-card ${borderColors[type]} 
      ${isPopular ? 'border-neon-red shadow-neon-strong' : 'hover:shadow-neon'} 
      transition-all duration-300 transform hover:scale-105 group relative
    `}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-red-500 to-neon-red">
            Mais Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${gradients[type]} rounded-xl mb-4 ${isPopular ? 'group-hover:shadow-neon' : 'group-hover:shadow-lg'} transition-all duration-300`}>
          {icon}
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-gray-400">{description}</CardDescription>
        <div className="text-4xl font-bold text-white mt-2">
          {price}<span className="text-lg text-gray-400">/mês</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={() => onSelect(type)}
          className={`w-full bg-gradient-to-r ${gradients[type]} hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
        >
          Escolher Plano
        </Button>
      </CardContent>
    </Card>
  );
}
