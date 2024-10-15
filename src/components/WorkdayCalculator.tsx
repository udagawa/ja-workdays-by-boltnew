import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, format } from 'date-fns';
import axios from 'axios';

interface WorkdayCalculatorProps {
  selectedDate: Date;
  calendarUrl: string;
}

interface WorkdayInfo {
  month: string;
  workdays: number;
}

const WorkdayCalculator: React.FC<WorkdayCalculatorProps> = ({ selectedDate, calendarUrl }) => {
  const [workdayInfo, setWorkdayInfo] = useState<WorkdayInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateWorkdays = async () => {
      setLoading(true);
      setError(null);

      try {
        const holidays = await fetchHolidays(calendarUrl);
        const months = [subMonths(selectedDate, 1), selectedDate, addMonths(selectedDate, 1)];

        const workdayInfo = months.map(month => {
          const start = startOfMonth(month);
          const end = endOfMonth(month);
          const days = eachDayOfInterval({ start, end });
          const workdays = days.filter(day => !isWeekend(day) && !isHoliday(day, holidays)).length;

          return {
            month: format(month, 'yyyy年MM月'),
            workdays
          };
        });

        setWorkdayInfo(workdayInfo);
      } catch (err) {
        setError('休日データの取得に失敗しました。URLを確認してください。');
      } finally {
        setLoading(false);
      }
    };

    calculateWorkdays();
  }, [selectedDate, calendarUrl]);

  const fetchHolidays = async (url: string): Promise<Date[]> => {
    if (!url) return [];

    try {
      const response = await axios.get(url);
      // ここでは、APIのレスポンス形式に応じてパースする必要があります
      // この例では、レスポンスが { holidays: ['2023-01-01', '2023-01-02', ...] } の形式であると仮定しています
      return response.data.holidays.map((dateString: string) => new Date(dateString));
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
      return [];
    }
  };

  const isHoliday = (date: Date, holidays: Date[]): boolean => {
    return holidays.some(holiday => holiday.getTime() === date.getTime());
  };

  if (loading) {
    return <div className="text-center">計算中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      {workdayInfo.map((info, index) => (
        <div key={index} className="mb-2">
          <span className="font-semibold">{info.month}:</span> {info.workdays}日
        </div>
      ))}
    </div>
  );
};

export default WorkdayCalculator;