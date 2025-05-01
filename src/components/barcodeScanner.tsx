"use client";

import { useZxing } from "react-zxing";

type Props = {
  onResult: (value: string) => void;
};

export const BarcodeScanner = ({ onResult }: Props) => {
  const {
    ref,
    torch: { on, off, isOn, isAvailable },
  } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      console.log("✅ QR code scanné :", text);
      onResult(text);
    },
    timeBetweenDecodingAttempts: 500,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={ref as React.RefObject<HTMLVideoElement>} className="rounded-md w-full max-w-md" />
      {isAvailable ? (
        <button
          onClick={() => (isOn ? off() : on())}
          className="text-sm text-blue-600 underline"
        >
          {isOn ? "Éteindre la lampe" : "Allumer la lampe"}
        </button>
      ) : (
        <span className="text-sm text-muted-foreground italic">
          Lampe non disponible
        </span>
      )}
    </div>
  );
};