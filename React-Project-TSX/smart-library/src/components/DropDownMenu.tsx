import React from 'react';

interface DropdownMenuProps {
  onSort: (order: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onSort }) => {
  return (
    <div className="absolute w-60 md:w-48 sm:w-40 bg-[#172242] rounded-lg flex flex-col justify-start items-start gap-2 z-10 shadow-lg font-['Work Sans']">
      <div className="w-full px-4 py-2 bg-[#172242] rounded-t-lg border border-[#172242]">
        <div className="text-[#f7f4ff] text-sm font-normal leading-tight tracking-tight">Most Trending</div>
      </div>
      <div className="flex flex-col w-full bg-[#172242] border-l-2 border-r-2 border-b-2 border-[#172242] rounded-b-lg">
        <div className="w-full px-4 py-1">
          <div className="text-[#f7f4ff] text-sm font-normal leading-tight tracking-tight">Recently Added</div>
        </div>
        <div className="w-full px-4 py-2">
          <div className="text-white text-sm font-normal leading-tight tracking-tight">Recommended</div>
        </div>
        <div className="w-full px-4 py-2">
          <div className="text-white text-sm font-normal leading-tight tracking-tight">Most recent publish year</div>
        </div>
        <div className="w-full px-4 py-2">
          <div className="text-white text-sm font-normal leading-tight tracking-tight">Earliest publish year</div>
        </div>
        <div className="w-full px-4 py-2 cursor-pointer" onClick={() => onSort('desc')}>
          <div className="text-white text-sm font-normal leading-tight tracking-tight">Top rated</div>
        </div>
        <div className="w-full px-4 py-2 cursor-pointer" onClick={() => onSort('asc')}>
          <div className="text-white text-sm font-normal leading-tight tracking-tight">Least rated</div>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
