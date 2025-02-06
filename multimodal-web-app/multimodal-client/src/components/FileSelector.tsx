import React, { useState } from 'react';

export function FileSelector(){
  const [file, setFile] = useState<File | null>(null);

  // Función para manejar el cambio de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div>
      <h1>Selecciona un archivo</h1>
      <input type="file" onChange={handleFileChange} />
      {file && (
        <div>
          <p>Archivo seleccionado: {file.name}</p>
          <p>Tipo de archivo: {file.type}</p>
          <p>Tamaño: {file.size} bytes</p>
        </div>
      )}
    </div>
  );
};