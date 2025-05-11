import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function ServiceSuccessCreatePage() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold">Prestation bien créée !</CardTitle>
          <CardDescription>Votre demande de prestation a été enregistrée avec succès.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Confirmation</AlertTitle>
            <AlertDescription>
              Votre demande de prestation va être étudiée par notre équipe. Vous serez notifié dès qu'une décision sera prise.
            </AlertDescription>
          </Alert>
          <div className="mt-6 space-y-2 text-center text-muted-foreground">
            <p>Merci pour votre patience.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/office/dashboard">Aller au tableau de bord</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
