import { useState, useEffect, useCallback, useMemo } from "react";
import { FilesystemItem } from "@/components/ui/filesystem-items";
import axiosInstance from "@/api/axiosInstance";
import { File } from "lucide-react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useTranslation } from "react-i18next";
import MyPDFReader from "@/components/pdf-viewer";
import { ProfileAPI } from "@/api/profile.api";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const generateStableId = (node: any, index: number) => {
  return `${node.name}-${index}-${JSON.stringify(node.url || '')}`;
};

export default function DocumentsPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [nodes, setNodes] = useState<{ name: string; url?: string }[]>([]);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("client.pages.office.myDocuments.home"),
          t("client.pages.office.myDocuments.myDocuments"),
        ],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchMyDocuments = async () => {
      try {
        const response = await ProfileAPI.getMyProfileDocuments();
        setNodes([response]);
      } catch (error) {
        console.error(t("client.pages.office.myDocuments.error"), error);
      }
    };
    fetchMyDocuments();
  }, [t]);

  const detectFileType = (fileName: string, arrayBuffer: ArrayBuffer) => {
    const extension = fileName?.toLowerCase().split('.').pop();
    
    const uint8Array = new Uint8Array(arrayBuffer);
    
    if (uint8Array[0] === 0x25 && uint8Array[1] === 0x50 && uint8Array[2] === 0x44 && uint8Array[3] === 0x46) {
      return 'application/pdf';
    }
    
    if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
      return 'image/png';
    }
    
    if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
      return 'image/jpeg';
    }
    
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'application/octet-stream';
    }
  };

  const handleFileClick = useCallback(
    async (url: string, name?: string) => {
      try {
        console.log("Fichier cliqué:", name, "URL:", url);
        
        const encodedUrl = encodeURIComponent(url);
        const requestUrl = `/client/utils/document?url=${encodedUrl}`;

        const response = await axiosInstance.get(requestUrl, {
          responseType: "arraybuffer",
        });

        const serverContentType = response.headers["content-type"];
        console.log("Content-Type serveur:", serverContentType); 
        
        const detectedType = detectFileType(name || '', response.data);
        console.log("Type détecté:", detectedType); 
        
        const blob = new Blob([response.data], { type: detectedType });
        const objectURL = URL.createObjectURL(blob);

        if (detectedType === "application/pdf") {
          if (isMobile) {
            const link = document.createElement("a");
            link.href = objectURL;
            link.download = name || "document.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(objectURL);
          } else {
            if (pdfUrl) {
              URL.revokeObjectURL(pdfUrl);
            }
            setPdfUrl(objectURL);
            console.log("PDF URL définie:", objectURL); 
          }
        } else if (detectedType.startsWith("image/")) {
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
          }
          setPdfUrl(objectURL);
        } else {
          const link = document.createElement("a");
          link.href = objectURL;
          link.download = name || "document";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(objectURL);
        }
      } catch (error) {
        console.error(t("client.pages.office.myDocuments.error"), error);
      }
    },
    [isMobile, t, pdfUrl] 
  );

  const filesystemItems = useMemo(() => {
    return nodes.map((node, index) => (
      <FilesystemItem
        key={generateStableId(node, index)}
        node={node}
        animated
        onFileClick={handleFileClick}
      />
    ));
  }, [nodes, handleFileClick]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="h-full">
      {isMobile ? (
        <div className="flex flex-col h-full">
          <div className="w-full p-4 border-b overflow-y-auto max-h-[40vh]">
            <ul>
              {filesystemItems}
            </ul>
          </div>
        </div>
      ) : (
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full rounded-lg border"
        >
          <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
            <div className="h-full p-4 overflow-y-auto">
              <ul>
                {filesystemItems}
              </ul>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={75} minSize={50}>
            <div className="h-full p-4">
              {pdfUrl ? (
                <div className="h-full">
                  <MyPDFReader fileURL={pdfUrl} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <File size={32} className="text-muted-foreground/50 mb-2" />
                  <h3 className="text-lg font-medium">
                    {t("client.pages.office.myDocuments.noDocumentSelected")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("client.pages.office.myDocuments.selectDocument")}
                  </p>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}