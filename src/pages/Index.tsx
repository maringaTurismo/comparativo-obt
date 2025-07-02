import React, { useState, useMemo } from 'react';
import { Search, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ComparisonTable from '../components/ComparisonTable';
import FilterPanel from '../components/FilterPanel';
import CategoryFilter from '../components/CategoryFilter';
import AddRowModal from '../components/AddRowModal';
import AddColumnModal from '../components/AddColumnModal';
import { useNavigate } from 'react-router-dom';

// Dados do comparativo organizados com seções
const initialData = [
  // Funcionalidades Gerais
  { categoria: "Funcionalidades Gerais", isSection: true },
  { categoria: "Conteúdo GDS (Air & Htl)", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Não" },
  { categoria: "Selfbooking (Domético e Internacional)", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Sim" },
  { categoria: "Self-Ticketing (Doméstico e Internacional)", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Não", paytrack: "Sim" },
  { categoria: "Robô de Emissão", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Sim" },
  { categoria: "Criação PNR`s Sabre", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Não" },
  { categoria: "Multi-Idiomas (Inglês, Portugues e Espanhol)", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Sim" },
  { categoria: "Controle País de Risco", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Não" },
  { categoria: "Hotel On line", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Sim" },
  { categoria: "Bilhetes não voados - Relatório", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Sim" },
  { categoria: "Bilhetes não voados - Alerta", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Não", paytrack: "Não" },
  
  // Aéreo
  { categoria: "Aéreo", isSection: true },
  { categoria: "Conteúdo Cias Aéreas Regionais", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Não" },
  { categoria: "Reserva de Assentos Automáticos", argo: "Sim", lemontech: "Sim", reserve: "Não", sapConcur: "Sim", getThere: "Sim", paytrack: "Não" },
  { categoria: "Envio automático do cartão de milhagem para a cia aérea", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Não" },
  
  // Hotel
  { categoria: "Hotel", isSection: true },
  { categoria: "Provedores WEB (B2B, HRS, Trend, TravelPool, Cangooro e outros)", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Não", getThere: "Não", paytrack: "Sim" },
  { categoria: "Busca pelo Mapa", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Não" },
  { categoria: "Cancelamento da reserva com o fornecedor", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Não" },
  
  // Locação
  { categoria: "Locação", isSection: true },
  { categoria: "Processo Online", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Sim" },
  { categoria: "Busca por Endereço", argo: "Sim", lemontech: "Sim", reserve: "Não", sapConcur: "Sim", getThere: "Sim", paytrack: "_" },
  { categoria: "Reserva Doméstica", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Sim" },
  
  // Fluxo de Aprovação
  { categoria: "Fluxo de Aprovação", isSection: true },
  { categoria: "Por Empresa", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "_" },
  { categoria: "Por Centro de custo", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "_" },
  { categoria: "Por Viajante", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "_" },
  
  // Formas de Pagamento
  { categoria: "Formas de Pagamento", isSection: true },
  { categoria: "Cartão Virtual", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Sim" },
  { categoria: "Faturado", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Não", getThere: "Sim", paytrack: "Não" },
  { categoria: "Pagto Direto", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Sim" },
  
  // Outras Funcionalidades e Produtos
  { categoria: "Outras Funcionalidades e Produtos", isSection: true },
  { categoria: "Hold Trips (PNR em espera que permite o auto cancelamento)", argo: "Sim", lemontech: "Sim", reserve: "Não", sapConcur: "Sim", getThere: "Sim", paytrack: "Não" },
  { categoria: "Relatórios On Line", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "Sim" },
  { categoria: "SSO", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "_" },
  
  // Expense
  { categoria: "Expense", isSection: true },
  { categoria: "Adiantamento", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Não", paytrack: "Sim" },
  { categoria: "Fechamento de Cartão", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Não", paytrack: "Sim" },
  { categoria: "Anexa Recibos", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Não", paytrack: "Sim" },
  
  // Mobile
  { categoria: "Mobile", isSection: true },
  { categoria: "Aprova solicitações", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "_" },
  { categoria: "Gerencia as viagens", argo: "Sim", lemontech: "Sim", reserve: "Sim", sapConcur: "Sim", getThere: "Sim", paytrack: "_" },
  { categoria: "Check-in web", argo: "Sim", lemontech: "Sim", reserve: "Não", sapConcur: "Sim", getThere: "Sim", paytrack: "_" }
];

// Função para salvar dados no localStorage
const saveDataToStorage = (data: any[], obtNames: Record<string, string>) => {
  localStorage.setItem('obt-comparison-data', JSON.stringify(data));
  localStorage.setItem('obt-names', JSON.stringify(obtNames));
};

// Função para carregar dados do localStorage
const loadDataFromStorage = () => {
  const savedData = localStorage.getItem('obt-comparison-data');
  const savedObtNames = localStorage.getItem('obt-names');
  
  return {
    data: savedData ? JSON.parse(savedData) : initialData,
    obtNames: savedObtNames ? JSON.parse(savedObtNames) : {
      argo: 'Argo',
      lemontech: 'Lemontech',
      reserve: 'Reserve',
      sapConcur: 'SAP Concur',
      getThere: 'GetThere',
      paytrack: 'Paytrack'
    }
  };
};

const Index = () => {
  const { data: storedData, obtNames: storedObtNames } = loadDataFromStorage();
  
  const [data, setData] = useState(storedData);
  const [obtNames, setObtNames] = useState(storedObtNames);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [isConfigMode, setIsConfigMode] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const initialVisible: Record<string, boolean> = {};
    Object.keys(storedObtNames).forEach(key => {
      initialVisible[key] = true;
    });
    return initialVisible;
  });
  
  const navigate = useNavigate();

  const categories = useMemo(() => {
    return data.filter(item => item.isSection).map(item => item.categoria);
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = data;

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      const categoryIndex = filtered.findIndex(item => item.categoria === selectedCategory && item.isSection);
      if (categoryIndex !== -1) {
        const nextSectionIndex = filtered.findIndex((item, index) => 
          index > categoryIndex && item.isSection
        );
        const endIndex = nextSectionIndex === -1 ? filtered.length : nextSectionIndex;
        filtered = filtered.slice(categoryIndex, endIndex);
      }
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [data, searchTerm, selectedCategory]);

  const handleCellChange = (rowIndex: number, obtKey: string, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [obtKey]: value };
    setData(newData);
    setLastUpdate(new Date());
    saveDataToStorage(newData, obtNames);
  };

  const handleAddRow = (category: string, functionality: string) => {
    const categoryIndex = data.findIndex(item => item.categoria === category && item.isSection);
    if (categoryIndex !== -1) {
      const nextSectionIndex = data.findIndex((item, index) => 
        index > categoryIndex && item.isSection
      );
      const insertIndex = nextSectionIndex === -1 ? data.length : nextSectionIndex;
      
      const newRow: any = { categoria: functionality };
      Object.keys(obtNames).forEach(key => {
        newRow[key] = '_';
      });
      
      const newData = [...data];
      newData.splice(insertIndex, 0, newRow);
      setData(newData);
      setLastUpdate(new Date());
      saveDataToStorage(newData, obtNames);
    }
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
    setLastUpdate(new Date());
    saveDataToStorage(newData, obtNames);
  };

  const handleAddColumn = (obtKey: string, obtName: string) => {
    const newObtNames = { ...obtNames, [obtKey]: obtName };
    const newData = data.map(row => ({
      ...row,
      [obtKey]: row.isSection ? undefined : '_'
    }));
    
    setObtNames(newObtNames);
    setData(newData);
    setVisibleColumns(prev => ({ ...prev, [obtKey]: true }));
    setLastUpdate(new Date());
    saveDataToStorage(newData, newObtNames);
  };

  const handleNavigateToInsights = () => {
    navigate('/insights');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Comparativo de Ferramentas de OBT
            </h1>
            <p className="text-xs text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Compare funcionalidades entre as principais ferramentas de Online Booking Tools do mercado.
              Analise recursos, capacidades e características para escolher a melhor solução para sua empresa.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar funcionalidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <div className="mt-6 pt-6 border-t">
            {/* Column Visibility Controls */}
            <FilterPanel 
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
              obtNames={obtNames}
              isConfigMode={isConfigMode}
              setIsConfigMode={setIsConfigMode}
            />
          </div>
        </div>

        {/* Comparison Table */}
        <ComparisonTable 
          data={filteredData}
          visibleColumns={visibleColumns}
          obtNames={obtNames}
          onCellChange={handleCellChange}
          onAddRow={() => setIsAddRowModalOpen(true)}
          onDeleteRow={handleDeleteRow}
          isConfigMode={isConfigMode}
        />

        {/* Action Buttons */}
        <div className="mt-12 flex justify-center">
          <Button
            onClick={handleNavigateToInsights}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            Painel de Insights
          </Button>
        </div>

        {/* Last Update Info */}
        {lastUpdate && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Última atualização: {lastUpdate.toLocaleString('pt-BR')}
            </p>
          </div>
        )}
      </div>

      {/* Add Row Modal */}
      <AddRowModal
        isOpen={isAddRowModalOpen}
        onClose={() => setIsAddRowModalOpen(false)}
        onAdd={handleAddRow}
        categories={categories}
      />
    </div>
  );
};

export default Index;
