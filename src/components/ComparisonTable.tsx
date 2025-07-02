
import React, { useState } from 'react';
import { Check, X, Minus, Database, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TableData {
  categoria: string;
  isSection?: boolean;
  [key: string]: string | boolean | undefined;
}

interface ComparisonTableProps {
  data: TableData[];
  visibleColumns: Record<string, boolean>;
  obtNames: Record<string, string>;
  onCellChange: (rowIndex: number, obtKey: string, value: string) => void;
  onAddRow: () => void;
  onDeleteRow: (rowIndex: number) => void;
  isConfigMode: boolean;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  data, 
  visibleColumns, 
  obtNames,
  onCellChange,
  onAddRow,
  onDeleteRow,
  isConfigMode
}) => {
  const [editingCell, setEditingCell] = useState<{row: number, col: string} | null>(null);

  const renderCell = (value: string | undefined, rowIndex: number, obtKey: string) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.col === obtKey;
    
    if (isEditing) {
      return (
        <Select
          value={value || ''}
          onValueChange={(newValue) => {
            onCellChange(rowIndex, obtKey, newValue);
            setEditingCell(null);
          }}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingCell(null);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sim">Sim</SelectItem>
            <SelectItem value="Não">Não</SelectItem>
            <SelectItem value="Parcial">Parcial</SelectItem>
            <SelectItem value="_">N/A</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    if (!value || value === '_' || value === '') {
      return (
        <div 
          className="flex items-center justify-center p-3 rounded-lg bg-gray-50 text-gray-500 border border-gray-200 cursor-pointer hover:bg-gray-100"
          onClick={() => setEditingCell({row: rowIndex, col: obtKey})}
        >
          <Minus className="w-4 h-4" />
        </div>
      );
    }

    const isPositive = value === 'Sim';
    const isNegative = value === 'Não';
    const isPartial = value === 'Parcial' || value.toLowerCase().includes('parcial');

    const cellContent = (
      <div 
        className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer hover:opacity-80 ${
          isPositive ? 'bg-green-50 text-green-700 border-green-200' :
          isNegative ? 'bg-red-50 text-red-700 border-red-200' :
          isPartial ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
          'bg-orange-50 text-orange-700 border-orange-200'
        }`}
        onClick={() => setEditingCell({row: rowIndex, col: obtKey})}
      >
        <div className="flex items-center gap-2">
          {isPositive && <Check className="w-4 h-4" />}
          {isNegative && <X className="w-4 h-4" />}
          {isPartial && <span className="text-sm">🔶</span>}
          {!isPositive && !isNegative && !isPartial && <span className="text-xs">🔶</span>}
          <span className="font-medium text-sm">{isPositive ? 'Sim' : isNegative ? 'Não' : isPartial ? 'Parcial' : value}</span>
        </div>
      </div>
    );

    return cellContent;
  };

  const visibleObtKeys = Object.keys(obtNames).filter(key => visibleColumns[key]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-30 border-b-2 border-blue-200">
            <tr>
              <th className="sticky left-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 text-left text-sm font-bold text-gray-900 border-r-2 border-blue-200 min-w-[350px] z-40">
                <div className="flex items-center justify-between">
                  <span>Funcionalidade</span>
                  {isConfigMode && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onAddRow}
                      className="ml-2 h-8 w-8 p-0 transition-all duration-200 opacity-100"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </th>
              {visibleObtKeys.map((key) => (
                <th key={key} className="px-4 py-5 text-center text-sm font-bold text-gray-900 min-w-[140px] border-r border-gray-100">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-base">{obtNames[key]}</span>
                  </div>
                </th>
              ))}
              {isConfigMode && (
                <th className="px-4 py-5 text-center text-sm font-bold text-gray-900 min-w-[100px] border-r border-gray-100">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, index) => (
              <tr 
                key={index} 
                className={`transition-all duration-200 ${
                  row.isSection 
                    ? 'bg-blue-100 hover:bg-blue-150 border-t-2 border-blue-300' 
                    : 'bg-white hover:bg-gray-25 hover:shadow-sm'
                }`}
              >
                <td className={`sticky left-0 px-6 py-5 border-r-2 border-gray-200 z-20 ${
                  row.isSection 
                    ? 'bg-blue-100 text-blue-900 font-bold text-lg border-r-2 border-blue-300' 
                    : 'bg-white text-sm font-medium text-gray-900'
                }`}>
                  {row.categoria}
                </td>
                {visibleObtKeys.map((key, keyIndex) => (
                  <td key={key} className={`px-4 py-5 ${keyIndex < visibleObtKeys.length - 1 ? 'border-r border-gray-100' : ''}`}>
                    {row.isSection ? (
                      <div className="bg-blue-200 h-8 rounded-lg"></div>
                    ) : (
                      renderCell(row[key] as string, index, key)
                    )}
                  </td>
                ))}
                {isConfigMode && (
                  <td className="px-4 py-5 text-center">
                    {!row.isSection && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteRow(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-2">
            <Database className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">Nenhuma funcionalidade encontrada.</p>
          <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros de busca.</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;
