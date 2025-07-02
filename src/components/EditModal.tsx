
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TableData {
  categoria: string;
  isSection?: boolean;
  [key: string]: string | boolean | undefined;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TableData[];
  obtNames: Record<string, string>;
  onSave: (updatedData: TableData[]) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  obtNames,
  onSave
}) => {
  const [editData, setEditData] = useState<TableData[]>([]);
  const [newObtName, setNewObtName] = useState('');
  const [newFuncionalidade, setNewFuncionalidade] = useState('');
  const [currentObtNames, setCurrentObtNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && data.length > 0) {
      console.log('Initializing edit modal with data:', data.length);
      setEditData([...data]);
      setCurrentObtNames({...obtNames});
    }
  }, [isOpen, data, obtNames]);

  const handleCellEdit = (rowIndex: number, column: string, value: string) => {
    console.log('Editing cell:', rowIndex, column, value);
    const newData = [...editData];
    newData[rowIndex] = { ...newData[rowIndex], [column]: value };
    setEditData(newData);
  };

  const handleAddColumn = () => {
    if (!newObtName.trim()) return;
    
    console.log('Adding new column:', newObtName);
    const newKey = newObtName.toLowerCase().replace(/\s+/g, '_');
    const updatedData = editData.map(row => ({
      ...row,
      [newKey]: row.isSection ? '' : ''
    }));
    
    setEditData(updatedData);
    setCurrentObtNames({...currentObtNames, [newKey]: newObtName});
    setNewObtName('');
  };

  const handleAddRow = () => {
    if (!newFuncionalidade.trim()) return;
    
    console.log('Adding new row:', newFuncionalidade);
    const newRow: TableData = {
      categoria: newFuncionalidade,
      isSection: false
    };
    
    Object.keys(currentObtNames).forEach(key => {
      newRow[key] = '';
    });
    
    setEditData([...editData, newRow]);
    setNewFuncionalidade('');
  };

  const handleDeleteRow = (index: number) => {
    console.log('Deleting row:', index);
    const newData = editData.filter((_, i) => i !== index);
    setEditData(newData);
  };

  const handleSave = () => {
    console.log('Saving data with length:', editData.length);
    onSave(editData);
    onClose();
  };

  const handleBack = () => {
    console.log('Closing modal without saving');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-300 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleBack} 
                variant="outline" 
                className="flex items-center gap-2 border-gray-400"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-black">Edição do Comparativo</h1>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-gray-50 border-b border-gray-300 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            <div className="flex gap-2">
              <Input
                placeholder="Nome da nova ferramenta OBT"
                value={newObtName}
                onChange={(e) => setNewObtName(e.target.value)}
                className="flex-1 border-gray-400"
              />
              <Button 
                onClick={handleAddColumn} 
                variant="outline" 
                className="flex items-center gap-2 border-gray-400"
              >
                <Plus className="w-4 h-4" />
                Adicionar Coluna
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Nova funcionalidade"
                value={newFuncionalidade}
                onChange={(e) => setNewFuncionalidade(e.target.value)}
                className="flex-1 border-gray-400"
              />
              <Button 
                onClick={handleAddRow} 
                variant="outline" 
                className="flex items-center gap-2 border-gray-400"
              >
                <Plus className="w-4 h-4" />
                Adicionar Linha
              </Button>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="px-6 py-4">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-400">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-black font-semibold border-r border-gray-400 min-w-[300px]">
                    Funcionalidade
                  </th>
                  {Object.entries(currentObtNames).map(([key, name]) => (
                    <th key={key} className="px-4 py-3 text-center text-black font-semibold border-r border-gray-400 min-w-[120px]">
                      {name}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-black font-semibold w-20">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {editData.map((row, index) => (
                  <tr key={`row-${index}`} className={row.isSection ? 'bg-blue-100' : 'bg-white'}>
                    <td className={`px-4 py-3 border-r border-gray-400 border-b border-gray-300 ${
                      row.isSection 
                        ? 'font-bold text-blue-900' 
                        : 'text-black'
                    }`}>
                      {row.isSection ? (
                        <span>{row.categoria}</span>
                      ) : (
                        <Input
                          value={row.categoria}
                          onChange={(e) => handleCellEdit(index, 'categoria', e.target.value)}
                          className="w-full border-gray-300"
                        />
                      )}
                    </td>
                    {Object.keys(currentObtNames).map((key) => (
                      <td key={key} className="px-4 py-3 border-r border-gray-400 border-b border-gray-300">
                        {row.isSection ? (
                          <div className="bg-blue-200 h-8 rounded"></div>
                        ) : (
                          <Select
                            value={row[key] as string || ''}
                            onValueChange={(value) => handleCellEdit(index, key, value)}
                          >
                            <SelectTrigger className="w-full border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-300 z-50">
                              <SelectItem value="">-</SelectItem>
                              <SelectItem value="Sim">Sim</SelectItem>
                              <SelectItem value="Não">Não</SelectItem>
                              <SelectItem value="Parcial">Parcial</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center border-b border-gray-300">
                      {!row.isSection && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRow(index)}
                          className="text-red-600 hover:text-red-700 border-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="px-6 py-8 border-t border-gray-300">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
