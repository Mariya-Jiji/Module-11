'use client';

import { useQuery } from '@tanstack/react-query';

type DemoModel = {
  id: number;
  name: string;
  status: string;
  latency: string;
};

export default function DemoDataFetcher() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<DemoModel[]>({
    queryKey: ['demoData'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/demo-data`, { credentials: 'include' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Network response was not ok');
      }
      return res.json();
    },
  });

  return (
    <div className="p-4 sm:p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl max-w-2xl mx-auto my-4 sm:my-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">AI Models Status</h2>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {isFetching ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
          <p className="font-semibold mb-1">Error Loading Data</p>
          <p className="text-sm opacity-80">{error?.message || 'Something went wrong.'}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data?.map((model) => (
            <div key={model.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors gap-3 sm:gap-0">
              <div>
                <h3 className="text-white font-medium">{model.name}</h3>
                <p className="text-sm text-slate-400">Latency: {model.latency}</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`w-2 h-2 rounded-full ${model.status === 'Active' ? 'bg-green-500' : model.status === 'Training' ? 'bg-blue-500' : 'bg-slate-500'}`}></span>
                <span className="text-sm text-slate-300">{model.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
