"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 *  Provider를 이용해서 csr과 ssr을 구분하여 적용
 */
export default function Providers({ children }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
