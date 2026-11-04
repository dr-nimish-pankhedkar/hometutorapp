"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface TrendPoint {
  label: string;
  date: string;
  percent: number;
}

export function ScoreTrend({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -18 }}>
          <CartesianGrid vertical={false} stroke="#EFE9DA" />
          <XAxis dataKey="date" tick={{ fill: "#5E6678", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} ticks={[0, 50, 75, 100]} tick={{ fill: "#5E6678", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v) => [`${v}%`, "Score"]}
            labelFormatter={(_, p) => (p?.[0]?.payload as TrendPoint | undefined)?.label ?? ""}
            contentStyle={{ borderRadius: 12, border: "1px solid #E4DCC7", fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="percent"
            stroke="#E0892B"
            strokeWidth={3}
            dot={{ r: 5, fill: "#fff", stroke: "#E0892B", strokeWidth: 2.5 }}
            activeDot={{ r: 6, fill: "#E0892B" }}
            animationDuration={600}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
