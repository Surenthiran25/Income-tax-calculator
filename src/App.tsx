import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, Save, X, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

// Define types for our entries
interface Entry {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

function App() {
  // State for form inputs
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [filter, setFilter] = useState('all');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Calculate totals whenever entries change
  useEffect(() => {
    const income = entries
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const expense = entries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    setTotalIncome(income);
    setTotalExpense(expense);
    
    // Save to localStorage whenever entries change
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) return;
    
    if (editingId) {
      // Update existing entry
      setEntries(entries.map(entry => 
        entry.id === editingId 
          ? { 
              ...entry, 
              description, 
              amount: parseFloat(amount), 
              type 
            } 
          : entry
      ));
      setEditingId(null);
    } else {
      // Add new entry
      const newEntry: Entry = {
        id: Date.now().toString(),
        description,
        amount: parseFloat(amount),
        type,
        date: new Date().toISOString().split('T')[0]
      };
      setEntries([...entries, newEntry]);
    }
    
    // Reset form
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('income');
    setEditingId(null);
  };

  // Delete an entry
  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  // Edit an entry
  const editEntry = (entry: Entry) => {
    setDescription(entry.description);
    setAmount(entry.amount.toString());
    setType(entry.type);
    setEditingId(entry.id);
  };

  // Filter entries based on selected filter
  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;
    return entry.type === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with totals */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Income & Expense Tracker</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Income</p>
                  <p className="text-2xl font-bold text-green-700">${totalIncome.toFixed(2)}</p>
                </div>
                <TrendingUp className="text-green-500 h-8 w-8" />
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-700">${totalExpense.toFixed(2)}</p>
                </div>
                <TrendingDown className="text-red-500 h-8 w-8" />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Net Balance</p>
                  <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    ${(totalIncome - totalExpense).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="text-blue-500 h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Entry Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Entry' : 'Add New Entry'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Salary, Groceries, etc."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={type === 'income'}
                    onChange={() => setType('income')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Income</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={type === 'expense'}
                    onChange={() => setType('expense')}
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-700">Expense</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                {editingId ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Entry
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Entry
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>
          </form>
        </div>
        
        {/* Entries List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Transactions</h2>
            
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="filter"
                  value="all"
                  checked={filter === 'all'}
                  onChange={() => setFilter('all')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">All</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="filter"
                  value="income"
                  checked={filter === 'income'}
                  onChange={() => setFilter('income')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-gray-700">Income</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="filter"
                  value="expense"
                  checked={filter === 'expense'}
                  onChange={() => setFilter('expense')}
                  className="h-4 w-4 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-gray-700">Expense</span>
              </label>
            </div>
          </div>
          
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No entries found. Add some transactions to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.description}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${entry.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          entry.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => editEntry(entry)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            Income Expense Calculator © {new Date().getFullYear()} | Built with React and TailwindCSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;