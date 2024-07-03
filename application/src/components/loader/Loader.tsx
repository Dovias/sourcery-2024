import React from 'react';
export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="size-7 animate-spin">
        <div className="h-1/2 w-full rounded-tl-full rounded-tr-full flex justify-center overflow-clip">
          <div
            className="rotate-[-30deg] grid place-items-center rounded-full h-[200%] w-full bg-gradient-to-r from-transparent via-transparent via-30% to-black to-90%"
          >
            <div className="rounded-full size-2/3 bg-white">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
