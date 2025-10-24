import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
import toast from 'react-hot-toast';
import { userService } from '../service/user.service';

import { logout } from '../store/authSlice';
import { setEntries, addEntry, setCurrentChart, hideChart, loadFromStorage } from '../store/dataSlice';
import DataCard from './DataCard';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state:any) => state.auth);
  const { entries, currentChart, showChart } = useSelector((state:any) => state.data);
  const [aInput, setAInput] = useState('');
  const [bInput, setBInput] = useState('');
  const [cInput, setCInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewChart, setPreviewChart] = useState<any>(null);

  useEffect(() => {
    dispatch(loadFromStorage());
    setPreviewChart(null); // Clear preview on mount/login
    if (token) {
      fetchUserData();
    }
  }, [token]);



  const fetchUserData = async () => {
    try {
      const response = await userService.getUserData(token!);
      if (response.success) {
        dispatch(setEntries(response.data));
      }
    } catch (error: any) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all fields are filled
    if (!aInput || !bInput || !cInput) {
      toast.error('All fields are required');
      return;
    }
    
    const a = parseFloat(aInput);
    const b = parseFloat(bInput);
    const c = parseFloat(cInput);
    
    // Check if all values are greater than zero
    if (a <= 0 || b <= 0 || c <= 0) {
      toast.error('All values must be greater than zero');
      return;
    }
    
    // Check if any single value is 100 or more
    if (a >= 100 || b >= 100 || c >= 100) {
      toast.error('No single value can be 100 or more');
      return;
    }
    
    const sum = a + b + c;

    if (sum === 100) {
      // Show chart immediately on click
      dispatch(setCurrentChart({ valueA: a, valueB: b, valueC: c }));
      setPreviewChart(null); // Clear preview since we now have current chart
      
      // Start API call in background
      setLoading(true);
      setTimeout(async () => {
        try {
          const response = await userService.createData({ valueA: a, valueB: b, valueC: c }, token!);
          if (response.success) {
            toast.success('Data saved successfully!');
            dispatch(addEntry(response.data));
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to save data');
        } finally {
          setLoading(false);
        }
      }, 0);
    } else if (sum < 100) {
      toast.error(`Sum is ${sum}. Need ${100 - sum} more to reach 100`);
      dispatch(hideChart());
    } else {
      toast.error(`Sum is ${sum}. Reduce by ${sum - 100} to reach 100`);
      dispatch(hideChart());
    }
  };

  const handleLogout = () => {
    setPreviewChart(null); // Clear preview on logout
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Use preview chart if available, otherwise use current chart
  const displayChart = previewChart || currentChart;
  const chartData = displayChart ? [
    { id: 0, value: displayChart.valueA, label: `A: ${displayChart.valueA}%`, color: '#EF4444' },
    { id: 1, value: displayChart.valueB, label: `B: ${displayChart.valueB}%`, color: '#10B981' },
    { id: 2, value: displayChart.valueC, label: `C: ${displayChart.valueC}%`, color: '#3B82F6' }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name}!</h1>
              <p className="text-indigo-100">User Code: {user?.code}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Section */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Percentage Calculator
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-lg font-semibold text-gray-600">
                    Value A
                  </label>
                  <input
                    type="number"
                    value={aInput}
                    onChange={(e) => setAInput(e.target.value)}
                    min="0.01"
                    max="99.99"
                    step="0.01"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-xl text-center focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-lg font-semibold text-gray-600">
                    Value B
                  </label>
                  <input
                    type="number"
                    value={bInput}
                    onChange={(e) => setBInput(e.target.value)}
                    min="0.01"
                    max="99.99"
                    step="0.01"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-xl text-center focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-lg font-semibold text-gray-600">
                    Value C
                  </label>
                  <input
                    type="number"
                    value={cInput}
                    onChange={(e) => setCInput(e.target.value)}
                    min="0.01"
                    max="99.99"
                    step="0.01"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-xl text-center focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Calculate & Save'}
              </button>
            </form>

            {showChart && currentChart ? (
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  📊 Current Distribution
                </h3>
                <div className="flex justify-center">
                  <PieChart
                    series={[{
                      data: chartData,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      innerRadius: 40,
                      outerRadius: 120,
                    }]}
                    width={400}
                    height={300}

                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-red-100 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{displayChart.valueA}%</div>
                    <div className="text-sm text-red-800">Value A</div>
                  </div>
                  <div className="text-center p-3 bg-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{displayChart.valueB}%</div>
                    <div className="text-sm text-green-800">Value B</div>
                  </div>
                  <div className="text-center p-3 bg-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{displayChart.valueC}%</div>
                    <div className="text-sm text-blue-800">Value C</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Data History Section */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Your Data History
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {entries.length > 0 ? (
                entries.map((data: any, index: number) => (
                  <DataCard key={data.id} data={data} index={index} />
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No data entries yet</p>
                  <p className="text-sm">Start by creating your first calculation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;