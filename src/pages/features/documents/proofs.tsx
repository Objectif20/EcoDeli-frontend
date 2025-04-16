import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { UserApi } from "@/api/user.api";

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
  const [documentDescription, setDocumentDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Documents"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  const fetchDocuments = async () => {
    try {
      const data = await UserApi.getProviderDocuments();

      const mappedDocs: Document[] = data.map((doc: any) => ({
        id: doc.provider_documents_id,
        name: doc.name,
        extension: doc.name.split('.').pop() || '',
        uploadDate: doc.submission_date,
        url: doc.download_url,
      }));

      setDocuments(mappedDocs);
    } catch (error) {
      console.error("Erreur lors de la récupération des documents", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile || !documentName) {
      alert("Veuillez sélectionner un fichier et entrer un nom.");
      return;
    }

    try {
      await UserApi.uploadProviderDocument(selectedFile, documentName, documentDescription);
      setDocumentName("");
      setDocumentDescription("");
      setSelectedFile(null);
      await fetchDocuments(); // 🔁 Refresh list
    } catch (error) {
      console.error("Erreur lors de l'envoi du document :", error);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Liste des Documents</h1>
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
        <Dialog>
          <DialogTrigger>
            <Button className="w-full md:w-auto">Ajouter un justificatif</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un justificatif</DialogTitle>
              <DialogDescription>
                Veuillez sélectionner un fichier, donner un nom et une description.
              </DialogDescription>
            </DialogHeader>
            <FileUpload onChange={(files) => setSelectedFile(files[0] || null)} />
            <Label htmlFor="document-name">Nom du document</Label>
            <Input
              id="document-name"
              placeholder="Entrez un nom"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
            <Label htmlFor="document-description" className="mt-2">Description</Label>
            <Textarea
              id="document-description"
              placeholder="Entrez une description"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
            />
            <Button onClick={handleSubmit} className="mt-4">
              Envoyer
            </Button>
          </DialogContent>
        </Dialog>
        <Button
          onClick={() => navigate("/office/documents")}
          className="w-full md:w-auto md:ml-auto"
        >
          Accéder à tous mes documents
        </Button>
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
