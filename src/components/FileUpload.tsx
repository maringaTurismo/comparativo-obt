
import React, { useState } from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onDataLoad: (data: any[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoad }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simular upload e processamento
    setTimeout(() => {
      setIsUploading(false);
      // Aqui seria onde processaríamos o CSV real
      console.log('Arquivo processado:', file.name);
    }, 2000);
  };

  const handleUpdateData = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      console.log('Dados atualizados');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={isUploading}
            >
              <Upload className="w-4 h-4" />
              {isUploading ? 'Processando...' : 'Importar CSV'}
            </Button>
          </div>
          
          <span className="text-sm text-gray-500">
            ou use os dados de exemplo já carregados
          </span>
        </div>

        <Button
          onClick={handleUpdateData}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          disabled={isUploading}
        >
          <RefreshCw className={`w-4 h-4 ${isUploading ? 'animate-spin' : ''}`} />
          {isUploading ? 'Atualizando...' : 'Atualizar Dados'}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
