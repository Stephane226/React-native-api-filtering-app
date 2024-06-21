import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchLists from './screens/SearchLists';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchLists />
    </QueryClientProvider>
  );
};


export default App;

