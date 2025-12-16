"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { transactions, tags } from "@/lib/data"
import { Transaction } from "@/lib/types"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
];

export default function StatisticsPage() {
  const chartData = React.useMemo(() => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};

    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expense += transaction.amount;
      }
    });
    
    return Object.keys(monthlyData).map(month => ({
      month,
      income: monthlyData[month].income,
      expense: monthlyData[month].expense,
    })).reverse();
  }, []);
  
  const expenseByCategory = React.useMemo(() => {
    const categoryData: { [key: string]: number } = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const tag = tags.find(t => t.id === transaction.tagId);
        if (tag) {
          if (!categoryData[tag.name]) {
            categoryData[tag.name] = 0;
          }
          categoryData[tag.name] += transaction.amount;
        }
      });
      
    return Object.keys(categoryData).map(name => ({
      name,
      value: categoryData[name],
    }));
  }, []);

  return (
    <div className="p-statistics container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Statistics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="c-chart-container">
          <CardHeader>
            <CardTitle>Income vs. Expense</CardTitle>
            <CardDescription>Monthly overview of your cash flow.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                   <CartesianGrid vertical={false} />
                   <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                   <Tooltip cursor={{fill: "hsl(var(--muted))"}} content={<ChartTooltipContent />} />
                   <Legend />
                   <Bar dataKey="income" fill="hsl(var(--chart-1))" radius={4} />
                   <Bar dataKey="expense" fill="hsl(var(--chart-2))" radius={4} />
                 </BarChart>
               </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="c-chart-container">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Spending distribution by category.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={{}} className="h-[300px] w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                        <Pie
                            data={expenseByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={110}
                            innerRadius={70}
                            dataKey="value"
                            paddingAngle={5}
                        >
                            {expenseByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
