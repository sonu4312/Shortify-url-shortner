import React, { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Text } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DeviceStats({ stats }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const deviceCount = stats.reduce((acc, item) => {
    if (!acc[item.device]) {
      acc[item.device] = 0;
    }
    acc[item.device]++;
    return acc;
  }, {});

  const deviceResult = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device],
  }));

  const renderCustomizedLabel = ({ x, y, cx, cy, midAngle, outerRadius, percent, device }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 0.7;
    const [nx, ny] = [
      cx + radius * Math.cos(-midAngle * RADIAN),
      cy + radius * Math.sin(-midAngle * RADIAN),
    ];

    return (
      <Text x={isMobile ? nx : x} y={isMobile ? ny : y} fill="white" textAnchor="middle">
        {`${device}: ${(percent * 100).toFixed(0)}%`}
      </Text>
    );
  };

  return (
    <div className="w-full h-64 sm:h-96">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={deviceResult}
            label={renderCustomizedLabel}
            dataKey="count"
            labelLine={false}
            fill="#8884d8"
          >
            {deviceResult.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
