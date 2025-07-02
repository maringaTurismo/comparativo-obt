
import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import InsightsPanel from '../components/InsightsPanel';

const Insights = () => {
  const navigate = useNavigate();
  
  // Carregar dados dinâmicos do localStorage
  const loadDataFromStorage = () => {
    const savedData = localStorage.getItem('obt-comparison-data');
    const savedObtNames = localStorage.getItem('obt-names');
    
    return {
      data: savedData ? JSON.parse(savedData) : [],
      obtNames: savedObtNames ? JSON.parse(savedObtNames) : {}
    };
  };

  const { data: rawData, obtNames } = loadDataFromStorage();

  const obtStats = useMemo(() => {
    const features = rawData.filter(item => !item.isSection);
    const totalFeatures = features.length;
    
    if (totalFeatures === 0) return [];
    
    return Object.entries(obtNames).map(([key, name]) => {
      let score = 0;
      let fullCount = 0;
      const strengths: string[] = [];
      
      features.forEach(item => {
        const value = item[key] as string;
        if (value === 'Sim') {
          score += 1;
          fullCount += 1;
          // Identificar pontos fortes baseado em categorias
          if (item.categoria.includes('GDS') || item.categoria.includes('Selfbooking')) {
            strengths.push('Reservas Online');
          } else if (item.categoria.includes('Mobile') || item.categoria.includes('Aprova')) {
            strengths.push('Mobile');
          } else if (item.categoria.includes('Expense') || item.categoria.includes('Cartão')) {
            strengths.push('Gestão de Despesas');
          } else if (item.categoria.includes('Hotel') || item.categoria.includes('Aéreo')) {
            strengths.push('Conteúdo de Viagem');
          } else if (item.categoria.includes('Aprovação') || item.categoria.includes('Fluxo')) {
            strengths.push('Aprovações');
          }
        } else if (value === 'Parcial') {
          score += 0.5;
        }
        // 'Não' e '_' = 0 pontos
      });
      
      // Remover duplicatas dos pontos fortes
      const uniqueStrengths = [...new Set(strengths)];
      
      return {
        name: name as string,
        key,
        count: fullCount,
        total: totalFeatures,
        percentage: Math.round((fullCount / totalFeatures) * 100),
        score: Math.round(score * 10) / 10, // Arredondar para 1 casa decimal
        strengths: uniqueStrengths
      };
    });
  }, [rawData, obtNames]);

  const totalFeatures = rawData.filter(item => !item.isSection).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Comparativo
            </Button>
            
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Painel de Insights
              </h1>
              <p className="text-lg text-gray-600">
                Análise estatística e pontuação das ferramentas de OBT
              </p>
            </div>
            
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {totalFeatures > 0 ? (
          <InsightsPanel obtStats={obtStats} totalFeatures={totalFeatures} />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum dado disponível para análise.</p>
            <p className="text-gray-400 text-sm mt-2">Adicione funcionalidades na tela principal primeiro.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
