import auth1 from '@/assets/illustrations/auth1.svg';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function RegisterSuccess() {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <h1 className="text-4xl font-bold">Féliticitations</h1>
            <img
                src={auth1}
                alt="Illustration"
                className="w-72 my-5"
            />
            <p className="text-lg">
                Vous avez bien été enregistré. Vous pouvez maintenant vous connecter à votre compte.
            </p>
            <Button onClick={() => navigate("/auth/login")}>Me connecter</Button>
        </div>
    );
};