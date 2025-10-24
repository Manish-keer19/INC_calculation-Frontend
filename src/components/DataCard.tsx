import React, { useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

interface DataEntry {
  id: number;
  valueA: number;
  valueB: number;
  valueC: number;
  recordedAt: string;
}

interface DataCardProps {
  data: DataEntry;
  index: number;
}

const DataCard: React.FC<DataCardProps> = ({ data, index }) => {
  const [showMiniChart, setShowMiniChart] = useState(false);

  const chartData = [
    { id: 0, value: data.valueA, label: `A: ${data.valueA}%`, color: '#3B82F6' },
    { id: 1, value: data.valueB, label: `B: ${data.valueB}%`, color: '#8B5CF6' },
    { id: 2, value: data.valueC, label: `C: ${data.valueC}%`, color: '#06B6D4' }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-700">Entry #{index + 1}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {new Date(data.recordedAt).toLocaleDateString()}
          </span>
          <button
            onClick={() => setShowMiniChart(!showMiniChart)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showMiniChart ? '📊' : '👁️'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center mb-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">A</div>
          <div className="text-lg font-bold text-blue-800">{data.valueA}%</div>
        </div>
        <div className="bg-purple-100 p-2 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">B</div>
          <div className="text-lg font-bold text-purple-800">{data.valueB}%</div>
        </div>
        <div className="bg-cyan-100 p-2 rounded-lg">
          <div className="text-sm text-cyan-600 font-medium">C</div>
          <div className="text-lg font-bold text-cyan-800">{data.valueC}%</div>
        </div>
      </div>

      {showMiniChart && (
        <div className="bg-white rounded-lg p-3 border">
          <PieChart
            series={[{
              data: chartData,
              innerRadius: 20,
              outerRadius: 60,
            }]}
            width={200}
            height={150}
          />
        </div>
      )}
    </div>
  );
};

export default DataCard;