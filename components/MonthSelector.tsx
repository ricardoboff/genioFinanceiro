
import React from 'react';

interface Props {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const MonthSelector: React.FC<Props> = ({ selectedDate, onChange }) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const nextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onChange(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onChange(newDate);
  };

  return (
    <div className="flex items-center justify-between bg-white/10 rounded-2xl px-2 py-1 backdrop-blur-md border border-white/20 mb-6">
      <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
        <i className="fa-solid fa-chevron-left text-xs text-white"></i>
      </button>
      
      <div className="text-center">
        <span className="text-white font-bold text-sm block leading-none">
          {months[selectedDate.getMonth()]}
        </span>
        <span className="text-indigo-200 text-[10px] font-medium">
          {selectedDate.getFullYear()}
        </span>
      </div>

      <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
        <i className="fa-solid fa-chevron-right text-xs text-white"></i>
      </button>
    </div>
  );
};

export default MonthSelector;
