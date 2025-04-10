import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  File,
  FileCheck,
  FileType,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";
import React from "react";
import { FileUpload } from "@/components/file-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Document {
  id: string;
  name: string;
  extension: string;
  uploadDate: string;
  url: string;
}

const getIconByExtension = (extension: string) => {
  switch (extension.toLowerCase()) {
    case "pdf":
      return FileCheck;
    case "doc":
    case "docx":
      return FileType;
    case "xls":
    case "xlsx":
      return FileSpreadsheet;
    case "jpg":
    case "jpeg":
    case "png":
      return FileImage;
    default:
      return File;
  }
};

export default function ProofsPage() {
  const dispatch = useDispatch();
  const [documents, setDocuments] = useState<Document[]>([]);
  const navigate = useNavigate();
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Documents"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = {
          data: [
            {
              id: "1",
              name: "Rapport Annuel",
              extension: "pdf",
              uploadDate: "2023-10-01",
              url: "https://example.com/rapport-annuel.pdf",
            },
            {
              id: "2",
              name: "Présentation",
              extension: "pptx",
              uploadDate: "2023-09-25",
              url: "https://example.com/presentation.pptx",
            },
            {
              id: "3",
              name: "Image de Profil",
              extension: "jpg",
              uploadDate: "2023-09-20",
              url: "https://example.com/profile-image.jpg",
            },
          ],
        };

        setDocuments(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents", error);
      }
    };

    fetchDocuments();
  }, []);

  const handleSubmit = () => {
    console.log("Nom du document:", documentName);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Liste des Documents</h1>
      <div className="flex justify-between mb-4">
        <Dialog>
          <DialogTrigger>
            <Button>Ajouter un justificatif</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un justificatif</DialogTitle>
              <DialogDescription>
                Veuillez sélectionner un fichier et donner un nom au document.
              </DialogDescription>
            </DialogHeader>
            <FileUpload />
            <Label htmlFor="document-name">Nom du document</Label>
            <Input 
              id="document-name" 
              placeholder="Entrez un nom" 
              value={documentName}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setDocumentName(e.target.value)}
            />
            <Button onClick={handleSubmit} className="mt-4">Envoyer</Button>
          </DialogContent>
        </Dialog>
        <Button onClick={() => navigate("/office/documents")} className="ml-auto">Accéder à tous mes documents</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-background rounded-lg shadow-lg p-6 flex flex-col items-center text-center border hover:shadow-xl transition"
          >
            {React.createElement(getIconByExtension(doc.extension), {
              className: "w-16 h-16 text-foreground",
            })}
            <h2 className="mt-4 text-lg font-semibold">{doc.name}</h2>
            <p className="text-foreground uppercase">{doc.extension}</p>
            <p className="text-foreground text-sm mt-1">
              Uploadé le {new Date(doc.uploadDate).toLocaleDateString()}
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                const link = document.createElement("a");
                link.href = doc.url;
                link.download = doc.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Télécharger le document
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
