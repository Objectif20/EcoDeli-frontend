import React from 'react';
import {
  Root,
  Viewport,
  Pages,
  Page,
  CanvasLayer,
} from "@fileforge/pdfreader";

interface MyPdfReaderProps {
  fileURL: string;
  className?: string;
}

const MyPDFReader: React.FC<MyPdfReaderProps> = ({ fileURL, className }) => (
  <Root
    className={`bg-background border rounded-md overflow-auto` + className} 
    fileURL={fileURL}
    loader="Loading..."
  >
    <Viewport className="p-4">
      <Pages>
        <Page className="my-4">
          <CanvasLayer />
        </Page>
      </Pages>
    </Viewport>
  </Root>
);

export default MyPDFReader;
