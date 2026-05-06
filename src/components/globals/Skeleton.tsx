import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
};

export const MenuCardSkeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={`bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-6 space-y-6 ${className}`}>
      <Skeleton className="w-full h-48 rounded-[2rem]" />
      <div className="space-y-3">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-3/4 h-8" />
        <Skeleton className="w-full h-12" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ className }: SkeletonProps) => {
  return (
    <tr className={`border-b border-white/5 ${className}`}>
      <td className="px-6 py-4"><Skeleton className="w-16 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-32 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-24 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-20 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-16 h-4" /></td>
      <td className="px-6 py-4 text-right"><Skeleton className="w-12 h-4 ml-auto" /></td>
    </tr>
  );
};
