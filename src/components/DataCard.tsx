import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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

  const chartData = {
    labels: [`A: ${data.valueA}%`, `B: ${data.valueB}%`, `C: ${data.valueC}%`],
    datasets: [{
      data: [data.valueA, data.valueB, data.valueC],
      backgroundColor: ['#3B82F6', '#8B5CF6', '#06B6D4'],
      borderWidth: 1,
      borderColor: '#fff'
    }]
  };

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
            className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium transition-colors"
            title={showMiniChart ? 'Hide Chart' : 'Show Pie Chart'}
          >
            {showMiniChart ? '📊 Hide' : '📊 Chart'}
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
          <div style={{ width: '200px', height: '150px' }}>
            <Pie 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataCard;