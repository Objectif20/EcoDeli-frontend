import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { validateAccount } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import auth1 from "@/assets/illustrations/register-success.svg";
import { Spinner } from "@/components/ui/spinner";

const AccountValidationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const { secretCode } = useParams<{ secretCode: string }>();

  useEffect(() => {
    const validate = async () => {
      if (!secretCode) {
        setStatus("error");
        return;
      }

      try {
        await validateAccount(secretCode);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };

    validate();
  }, []);

  const handleGoToLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {status === "loading" && (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      )}

      {status === "success" && (
        <>
          <h1 className="text-3xl font-bold mb-4">
            {t("pages.validation.titreSucces")}
          </h1>
          <img src={auth1} alt="Illustration" className="w-72 my-5" />
          <p>{t("pages.validation.messageSucces")}</p>
          <Button onClick={handleGoToLogin} className="mt-5">
            {t("pages.validation.boutonConnexion")}
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-3xl font-bold mb-4">
            {t("pages.validation.titreErreur")}
          </h1>
          <p>{t("pages.validation.messageErreur")}</p>
          <Button onClick={handleGoToLogin} className="mt-5">
            {t("pages.validation.boutonConnexion")}
          </Button>
        </>
      )}
    </div>
  );
};

export default AccountValidationPage;
