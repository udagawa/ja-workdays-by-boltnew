import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import WorkdayCalculator from './components/WorkdayCalculator';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarUrl, setCalendarUrl] = useState('');

  const handlePrevMonth = () => {
    setSelectedDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prevDate => addMonths(prevDate, 1));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">稼働日数計算アプリ</h1>
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center">
            <Calendar size={24} className="mr-2" />
            <span className="text-lg font-semibold">{format(selectedDate, 'yyyy年MM月')}</span>
          </div>
          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200">
            <ChevronRight size={24} />
          </button>
        </div>
        <input
          type="text"
          value={calendarUrl}
          onChange={(e) => setCalendarUrl(e.target.value)}
          placeholder="休日カレンダーのURL（オプション）"
          className="w-full p-2 border rounded mb-4"
        />
        <WorkdayCalculator selectedDate={selectedDate} calendarUrl={calendarUrl} />
      </div>
    </div>
  );
}

export default App;