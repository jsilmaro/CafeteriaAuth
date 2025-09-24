import { QueryClient } from "@tanstack/react-query";

// Mock API request function
export async function apiRequest(method, url, data) {
  // TODO: backend integration - replace with actual fetch calls
  console.log(`Mock API ${method} ${url}`, data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock responses based on URL
  if (url.includes('/login')) {
    return {
      json: () => Promise.resolve({
        id: "user-1",
        fullname: "Admin User",
        staffId: "STAFF001",
        email: data.email
      })
    };
  }
  
  if (url.includes('/register')) {
    return {
      json: () => Promise.resolve({
        id: "user-2",
        fullname: data.fullname,
        staffId: data.staffId,
        email: data.email
      })
    };
  }
  
  return {
    json: () => Promise.resolve({ success: true })
  };
}

export const getQueryFn = (options) => async ({ queryKey }) => {
  // TODO: backend integration - replace with actual API calls
  console.log('Mock query:', queryKey);
  
  if (options.on401 === "returnNull") {
    return null;
  }
  
  // Mock user data
  const mockUser = localStorage.getItem('mockUser');
  return mockUser ? JSON.parse(mockUser) : null;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});