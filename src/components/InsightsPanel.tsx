
import React from 'react';
import { TrendingUp, Database, Award, Target, CheckCircle } from 'lucide-react';

interface ObtStat {
  name: string;
  key: string;
  count: number;
  total: number;
  percentage: number;
  score: number;
  strengths: string[];
}

interface InsightsPanelProps {
  obtStats: ObtStat[];
  totalFeatures: number;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ obtStats, totalFeatures }) => {
  const topPerformer = obtStats.reduce((prev, current) => 
    prev.score > current.score ? prev : current
  );

  const averageScore = obtStats.reduce((sum, stat) => sum + stat.score, 0) / obtStats.length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Total Features Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Funcionalidades</p>
              <p className="text-3xl font-bold text-gray-900">{totalFeatures}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Top Performer Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Melhor Pontuação</p>
              <p className="text-2xl font-bold text-green-600">{topPerformer.name}</p>
              <p className="text-sm text-gray-500">{topPerformer.score.toFixed(1)} pontos</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Average Score Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pontuação Média</p>
              <p className="text-3xl font-bold text-purple-600">{averageScore.toFixed(1)}</p>
              <p className="text-sm text-gray-500">de {totalFeatures} pontos</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Completude</p>
              <p className="text-3xl font-bold text-orange-600">
                {Math.round((averageScore / totalFeatures) * 100)}%
              </p>
              <p className="text-sm text-gray-500">média geral</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed OBT Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Análise Detalhada por OBT</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {obtStats
            .sort((a, b) => b.score - a.score)
            .map((stat) => (
            <div key={stat.key} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{stat.name}</h4>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{stat.score.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">pontos</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Funcionalidades Completas</span>
                  <span className="font-medium text-green-600">{stat.count} de {stat.total}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxa de Completude</span>
                  <span className="font-medium text-blue-600">{stat.percentage}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stat.score >= averageScore 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    }`}
                    style={{ width: `${(stat.score / totalFeatures) * 100}%` }}
                  ></div>
                </div>
                
                {stat.strengths.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Principais Pontos Fortes:</p>
                    <div className="flex flex-wrap gap-2">
                      {stat.strengths.slice(0, 5).map((strength, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Legend */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistema de Pontuação</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div className="font-medium text-green-700">Sim = 1.0 ponto</div>
              <div className="text-sm text-gray-600">Funcionalidade totalmente atendida</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div>
              <div className="font-medium text-yellow-700">Parcial = 0.5 pontos</div>
              <div className="text-sm text-gray-600">Funcionalidade parcialmente atendida</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div className="font-medium text-red-700">Não = 0 pontos</div>
              <div className="text-sm text-gray-600">Funcionalidade não atendida</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
