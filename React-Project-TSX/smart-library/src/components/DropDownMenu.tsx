import React from 'react';

interface DropdownMenuProps {
  onSort: (order: string, type: string) => void;
  onFetchRecommended: () => void;
}

const DropDownMenu: React.FC<DropdownMenuProps> = ({ onSort, onFetchRecommended }) => {
  return (
    <div className="absolute w-60 md:w-48 sm:w-40 bg-[#172242] rounded-lg flex flex-col justify-start items-start gap-2 z-10 shadow-lg font-['Work Sans']">
      <div className="flex flex-col w-full bg-[#172242] border-l-2 border-r-2 border-b-2 border-[#172242] rounded-b-lg">
        <div
          className="w-full px-4 py-2 cursor-pointer hover:bg-[#445a9a]"
          onClick={onFetchRecommended}
        >
          <div className="text-white text-sm font-normal leading-tight tracking-tight">Recommended</div>
        </div>
        <div
          className="w-full px-4 py-2 cursor-pointer hover:bg-[#445a9a]"
          onClick={() => onSort('desc', 'rating')}
        >
          <div className="text-white text-sm font-normal leading-tight tracking-tight">Top rated</div>
        </div>
        <div
          className="w-full px-4 py-2 cursor-pointer hover:bg-[#445a9a]"
          onClick={() => onSort('asc', 'rating')}
        >
          <div className="text-white text-sm font-normal leading-tight tracking-tight">Least rated</div>
        </div>
        <div
          className="w-full px-4 py-2 cursor-pointer hover:bg-[#445a9a]"
          onClick={() => onSort('desc', 'publish_year')}
        >
          <div className="text-white text-sm font-normal leading-tight tracking-tight">Most recent publish year</div>
        </div>
        <div
          className="w-full px-4 py-2 cursor-pointer hover:bg-[#445a9a]"
          onClick={() => onSort('asc', 'publish_year')}
        >
          <div className="text-white text-sm font-normal leading-tight tracking-tight">Earliest publish year</div>
        </div>
      </div>
    </div>
  );
};

export default DropDownMenu;
