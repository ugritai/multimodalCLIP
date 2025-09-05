import { useState } from "react";
import { TableCell } from "../ui/table";

export function RenderCell({ value, keyId }: { value: string; keyId: number | string }) {
  const [imgError, setImgError] = useState(false);

    function isValidUrl(value: string): boolean {
    try {
        new URL(value);
        return true;
    } 
    catch {
        return false;
    }
}

  if (isValidUrl(value) && !imgError) {
    return (
      <TableCell key={keyId}>
        <img
          src={value}
          alt="preview"
          className="max-h-20 object-contain"
          onError={() => setImgError(true)} 
        />
      </TableCell>
    );
  }

  return <TableCell key={keyId}>{value}</TableCell>;
}