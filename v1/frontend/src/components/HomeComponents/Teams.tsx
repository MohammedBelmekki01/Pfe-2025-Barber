
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const barbers = [
  { 
    name: "Ahmed Benali", 
    experience: 8, 
    specialty: "Coupes modernes & Barbier expert",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    certifications: ["Barbier certifié", "Formation internationale"]
  },
  { 
    name: "Youssef Karimi", 
    experience: 5, 
    specialty: "Rasage traditionnel & Coupes classiques",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    certifications: ["Expert rasage", "Coiffeur diplômé"]
  },
  { 
    name: "Hassan Alami", 
    experience: 12, 
    specialty: "Coupes enfants & Styles personnalisés",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    certifications: ["Maître barbier", "15 ans d'expérience"]
  },
];

export function Team() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Notre Équipe</Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">Barbiers Qualifiés</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Une équipe de professionnels passionnés à votre service
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {barbers.map((barber, i) => (
          <Card key={i} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-purple-500/10">
            <CardHeader className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <img 
                  src={barber.photo} 
                  alt={barber.name} 
                  className="w-full h-full rounded-full object-cover border-4 border-emerald-500 group-hover:scale-105 transition-transform shadow-lg" 
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">{barber.name}</CardTitle>
              <CardDescription className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {barber.specialty}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-lg p-4">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{barber.experience}</div>
                <div className="text-gray-600 dark:text-gray-300">années d'expérience</div>
              </div>
              <div className="space-y-2">
                {barber.certifications.map((cert, j) => (
                  <Badge key={j} variant="secondary" className="text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
