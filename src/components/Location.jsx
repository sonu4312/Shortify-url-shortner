import React from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Location({ stats }) {
  const cityCounts = stats.reduce((acc, item) => {
    if (acc[item.city]) {
      acc[item.city] += 1;
    } else acc[item.city] = 1;

    return acc;
  }, {});

  const cities = Object.entries(cityCounts).map(([city, count]) => ({
    city,
    count,
  }));

  return (
    <div className="w-full h-64 sm:h-96">
      <ResponsiveContainer>
        <LineChart data={cities.slice(0, 5)}>
          <XAxis dataKey="city" />
          <YAxis />
          <Tooltip labelStyle={{ color: "green" }} />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
