
import React from 'react';
import { Filter, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface FilterPanelProps {
  visibleColumns: Record<string, boolean>;
  setVisibleColumns: (columns: Record<string, boolean>) => void;
  obtNames: Record<string, string>;
  isConfigMode: boolean;
  setIsConfigMode: (isConfigMode: boolean) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  visibleColumns, 
  setVisibleColumns, 
  obtNames,
  isConfigMode,
  setIsConfigMode
}) => {
  const toggleColumn = (key: string) => {
    setVisibleColumns({
      ...visibleColumns,
      [key]: !visibleColumns[key]
    });
  };

  const toggleAll = () => {
    const allVisible = Object.values(visibleColumns).every(v => v);
    const newState = Object.keys(visibleColumns).reduce((acc, key) => {
      acc[key] = !allVisible;
      return acc;
    }, {} as Record<string, boolean>);
    setVisibleColumns(newState);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Mostrar OBTs:</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 transition-all duration-300 ${
            isConfigMode 
              ? 'bg-green-500 text-white px-3 py-2 rounded-lg' 
              : 'text-gray-700'
          }`}>
            <Settings className="w-4 h-4" />
            {!isConfigMode && <span className="text-sm font-medium">Configurações</span>}
          </div>
          <Switch
            checked={isConfigMode}
            onCheckedChange={setIsConfigMode}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAll}
          className="text-xs"
        >
          {Object.values(visibleColumns).every(v => v) ? 'Ocultar Todos' : 'Mostrar Todos'}
        </Button>
        
        {Object.entries(obtNames).map(([key, name]) => (
          <button
            key={key}
            onClick={() => toggleColumn(key)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              visibleColumns[key]
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-gray-100 border-gray-300 text-gray-500'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
