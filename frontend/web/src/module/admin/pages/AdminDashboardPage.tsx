import React, { useState } from "react";
import { useGetDashboardData } from "../features/dashboard/api/dashboard.api";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("30days");
  const { data, isLoading } = useGetDashboardData(period);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <div className="space-y-6 max-w-full pb-8">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <CalendarIcon size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Báo cáo Tổng quan
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 font-medium">
              Trung tâm phân tích số liệu tài chính và hoạt động kinh doanh.
            </p>
          </div>
        </div>

        <div className="relative z-10 w-full sm:w-auto">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
          >
            <option value="30days">30 ngày qua</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
            />
          ))}
          <div className="col-span-1 lg:col-span-3 h-[450px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800" />
          <div className="col-span-1 lg:col-span-1 h-[450px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800" />
        </div>
      ) : data ? (
        <>
          {/* Metrics List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Doanh thu tổng"
              value={formatCurrency(data.metrics.totalRevenue)}
              growth={data.metrics.revenueGrowth}
              icon={<DollarSign size={20} />}
              color="blue"
            />
            <MetricCard
              title="Tổng đơn hàng"
              value={new Intl.NumberFormat("vi-VN").format(
                data.metrics.totalOrders,
              )}
              growth={data.metrics.orderGrowth}
              icon={<ShoppingCart size={20} />}
              color="emerald"
            />
            <MetricCard
              title="Tour hoạt động"
              value={new Intl.NumberFormat("vi-VN").format(
                data.metrics.activeTours,
              )}
              growth={data.metrics.tourGrowth}
              icon={<Package size={20} />}
              color="amber"
            />
            <MetricCard
              title="Khách hàng mới"
              value={new Intl.NumberFormat("vi-VN").format(
                data.metrics.newCustomers,
              )}
              growth={data.metrics.customerGrowth}
              icon={<Users size={20} />}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area & Bar Chart Combo */}
            <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Báo cáo Dòng tiền & Đơn hàng
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Thống kê theo thời gian
                </p>
              </div>

              <div className="flex-1 w-full min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.revenueChart}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      dy={10}
                    />
                    <YAxis
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickFormatter={(value) => `${value / 1000000}M`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        backgroundColor: "var(--tw-colors-white)",
                      }}
                      itemStyle={{ fontWeight: 600 }}
                      formatter={(value: any, name: string) => [
                        name === "revenue" ? formatCurrency(value) : value,
                        name === "revenue" ? "Doanh thu" : "Đơn hàng",
                      ]}
                      labelStyle={{
                        fontWeight: "bold",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ paddingBottom: "20px" }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      name="revenue"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="orders"
                      name="orders"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                      opacity={0.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="mb-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Cơ cấu Thu nhập
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Tỉ trọng doanh thu theo loại hình
                </p>
              </div>

              <div className="flex-1 w-full min-h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.tourDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.tourDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      itemStyle={{ fontWeight: 600, color: "#333" }}
                      formatter={(value: any) => [`${value}%`, "Tỉ trọng"]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

// Sub Component cho Card chỉ số
function MetricCard({
  title,
  value,
  growth,
  icon,
  color,
}: {
  title: string;
  value: string;
  growth: number;
  icon: React.ReactNode;
  color: "blue" | "emerald" | "amber" | "purple";
}) {
  const isUp = growth >= 0;

  // Ánh xạ màu CSS động
  const colorMap = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-500",
    emerald:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-500",
    amber:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-500",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-500",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${colorMap[color]}`}>{icon}</div>
      </div>

      <div>
        <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2 truncate">
          {value}
        </h4>
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${isUp ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20" : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20"}`}
        >
          {isUp ? (
            <TrendingUp size={14} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={14} strokeWidth={2.5} />
          )}{" "}
          {Math.abs(growth)}%
        </div>
      </div>
    </div>
  );
}
