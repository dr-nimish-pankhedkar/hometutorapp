"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { TopicResult } from "@/lib/types";

export const statusColor = {
  Strong: "#1F6B60",
  "On track": "#E0892B",
  "Focus area": "#B5473A",
} as const;

export function MasteryChart({ topics }: { topics: TopicResult[] }) {
  const data = topics.map((t) => ({ name: t.topic.name, mastery: t.mastery, status: t.status }));
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 4, left: 0 }} barCategoryGap={10}>
          <CartesianGrid horizontal={false} stroke="#EFE9DA" />
          <XAxis
            type="number"
            domain={[0, 100]}
            ticks={[0, 50, 75, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: "#5E6678", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={128}
            tick={{ fill: "#16233F", fontSize: 12, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine x={50} stroke="#C9BFA6" strokeDasharray="3 3" />
          <ReferenceLine x={75} stroke="#C9BFA6" strokeDasharray="3 3" />
          <Bar dataKey="mastery" radius={[0, 6, 6, 0]} background={{ fill: "#F7F4EC", radius: 6 }} animationDuration={600}>
            {data.map((d) => (
              <Cell key={d.name} fill={statusColor[d.status]} />
            ))}
            <LabelList
              dataKey="mastery"
              position="right"
              formatter={(v) => `${v}%`}
              style={{ fill: "#16233F", fontSize: 12, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
