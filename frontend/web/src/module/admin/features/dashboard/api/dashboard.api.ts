import { useQuery } from "@tanstack/react-query";

export interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  orderGrowth: number;
  activeTours: number;
  tourGrowth: number;
  newCustomers: number;
  customerGrowth: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TourDistribution {
  name: string;
  value: number;
  color: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  revenueChart: RevenueDataPoint[];
  tourDistribution: TourDistribution[];
}

// Mock API Call cho Dashboard
export const useGetDashboardData = (period: string) => {
  return useQuery({
    queryKey: ["admin-dashboard", period],
    queryFn: async (): Promise<DashboardData> => {
      // Giả lập network delay để test loading state Skeleton
      await new Promise((resolve) => setTimeout(resolve, 600));

      const isYear = period === "year";
      return {
        metrics: {
          totalRevenue: isYear ? 15250000000 : 1250000000,
          revenueGrowth: isYear ? 45.2 : 14.2,
          totalOrders: isYear ? 4500 : 352,
          orderGrowth: 8.2,
          activeTours: 45,
          tourGrowth: -2.5,
          newCustomers: isYear ? 3200 : 128,
          customerGrowth: 12.5,
        },
        revenueChart: isYear
          ? Array.from({ length: 12 }, (_, i) => ({
              date: `T${i + 1}`,
              revenue: Math.floor(Math.random() * 2000000000) + 500000000,
              orders: Math.floor(Math.random() * 500) + 100,
            }))
          : Array.from({ length: 7 }, (_, i) => ({
              date: `Ngày ${i + 1}`,
              revenue: Math.floor(Math.random() * 50000000) + 10000000,
              orders: Math.floor(Math.random() * 50) + 10,
            })),
        tourDistribution: [
          { name: "Tour Nội Địa", value: 45, color: "#0ea5e9" },
          { name: "Tour Quốc Tế", value: 30, color: "#8b5cf6" },
          { name: "Gói Combo", value: 25, color: "#f59e0b" },
        ],
      };
    },
  });
};
