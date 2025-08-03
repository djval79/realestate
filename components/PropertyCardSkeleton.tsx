
import React from 'react';

const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg flex flex-col">
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
        
        <div className="grid grid-cols-3 gap-4 text-center my-4">
          <div>
            <div className="h-8 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
          </div>
          <div>
            <div className="h-8 w-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
          </div>
          <div>
            <div className="h-8 w-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-14 mx-auto bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
          </div>
        </div>

        <div className="mt-auto space-y-3 pt-4">
           <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
           <div className="grid grid-cols-2 gap-3 mt-3">
             <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
             <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;