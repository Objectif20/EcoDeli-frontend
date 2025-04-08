import { useState } from "react";
import axios from "axios";

import { FilesystemItem } from "@/components/ui/filesystem-items";

const nodes = [
  {
    name: "Home",
    nodes: [
      {
        name: "Movies",
        nodes: [
          {
            name: "Action",
            nodes: [
              {
                name: "2000s",
                nodes: [
                  { name: "Gladiator.mp4" },
                  { name: "The-Dark-Knight.mp4" },
                ],
              },
              { name: "2010s", nodes: [] },
            ],
          },
          {
            name: "Comedy",
            nodes: [{ name: "2000s", nodes: [{ name: "Superbad.mp4" }] }],
          },
          {
            name: "Drama",
            nodes: [
              { name: "2000s", nodes: [{ name: "American-Beauty.mp4" }] },
            ],
          },
        ],
      },
      {
        name: "Music",
        nodes: [
          { name: "Rock", nodes: [] },
          { name: "Classical", nodes: [] },
        ],
      },
      { name: "Pictures", nodes: [] },
      {
        name: "Documents",
        nodes: [
          { name: "report.pdf", url: "https://console.minio.remythibaut.fr/api/v1/buckets/test/objects/download?prefix=CV2A_V2.pdf&version_id=null" },
        ],
      },
      { name: "passwords.txt" },
    ],
  },
];

export default function DocumentsPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileClick = async (url: string) => {
    try {
      const response = await axios.get('http://localhost:3000/admin/global/documents', {
        params: { url },
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data], { type: "application/pdf" });

      const objectURL = URL.createObjectURL(blob);
      setPdfUrl(objectURL);

      const link = document.createElement("a");
      link.href = objectURL;
      link.download = "document.pdf"; 
      link.click();
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF :", error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 border-r overflow-y-auto">
        <ul>
          {nodes.map((node) => (
            <FilesystemItem
              node={node}
              key={node.name}
              animated
              onFileClick={handleFileClick}
            />
          ))}
        </ul>
      </div>
      <div className="w-3/4 p-4">
        {pdfUrl ? (
          <>
            <iframe
              src={pdfUrl} 
              width="100%"
              height="600"
              style={{ border: "none" }}
            />
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = "document.pdf"; 
                link.click();
              }}
              className="mt-4 p-2 bg-blue-500 text-white"
            >
              Télécharger le PDF
            </button>
          </>
        ) : (
          <p>Choisis un PDF</p>
        )}
      </div>
    </div>
  );
}
