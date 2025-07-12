import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import error404 from "@/assets/illustrations/404.svg";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-8xl font-bold">{t("pages.erreurs.404.titre")}</h1>
      <img src={error404} alt="Illustration" className="w-72 my-5" />
      <p className="text-lg">{t("pages.erreurs.404.message")}</p>
      <Button onClick={handleGoBack} className="mt-5">
        {t("pages.erreurs.404.bouton")}
      </Button>
    </div>
  );
};

export default NotFoundPage;
