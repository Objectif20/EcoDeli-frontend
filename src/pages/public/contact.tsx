import image from "@/assets/illustrations/deliveryPerson.svg";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
    const { t } = useTranslation();
  
    const sections = [
      {
        image: image,
        title: t("client.pages.public.contact.sections.faq.title"),
        description: t("client.pages.public.contact.sections.faq.description"),
        buttonText: t("client.pages.public.contact.sections.faq.button"),
        buttonLink: "/faq",
      },
      {
        image: image,
        title: t("client.pages.public.contact.sections.userIssue.title"),
        description: t("client.pages.public.contact.sections.userIssue.description"),
      },
      {
        image: image,
        title: t("client.pages.public.contact.sections.bugReport.title"),
        description: t("client.pages.public.contact.sections.bugReport.description"),
        email: "contact.ecodeli@gmail.com",
      },
    ];
  
    return (
      <div className="flex flex-col items-center py-32">
        <h1 className="text-4xl font-bold text-center mb-8">
          {t("client.pages.public.contact.title")}
        </h1>
        <p className="text-lg text-center max-w-2xl mb-12">
          {t("client.pages.public.contact.description")}
        </p>
  
        {sections.map((section, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center mb-12 md:mb-20 ${
              index === 1 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            <img
              src={section.image}
              alt={section.title}
              className="md:w-1/2 mb-6 md:mb-0 max-w-xs md:mr-6 md:ml-0"
            />
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <p className="mb-6">{section.description}</p>
              {section.buttonText && (
                <a
                  href={section.buttonLink}
                  className="bg-primary text-white px-4 py-2 rounded"
                >
                  {section.buttonText}
                </a>
              )}
              {section.email && (
                <a
                  href={`mailto:${section.email}`}
                  className="text-primaryunderline"
                >
                  {section.email}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ContactPage;
  
  
