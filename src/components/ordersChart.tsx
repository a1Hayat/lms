"use client";

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartData = {
  name: string;
  count: number;
};

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(221.2 83.2% 53.3%)",
  },
};

export function OrdersChart({ data }: { data: ChartData[] }) {
  return (
    <div className="p-4 rounded-xl border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all duration-300">
      <h2 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">
        Orders (Last 7 Days)
      </h2>

      <ChartContainer config={chartConfig} className="w-full">
        {/* ✅ Compact height (120px) */}
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 15, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-orders)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-orders)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.15} />
            <XAxis
              dataKey="name"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
            />
            <YAxis
              allowDecimals={false}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="count"
              name="Orders"
              type="monotone"
              fill="url(#colorOrders)"
              stroke="var(--color-orders)"
              strokeWidth={1.8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
