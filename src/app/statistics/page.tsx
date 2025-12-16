"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { transactions, tags } from "@/lib/data"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function StatisticsPage() {
  const chartData = React.useMemo(() => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse();

    months.forEach(month => {
        monthlyData[month] = { income: 0, expense: 0 };
    });

    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      if (monthlyData[month]) {
        if (transaction.type === 'income') {
          monthlyData[month].income += transaction.amount;
        } else {
          monthlyData[month].expense += transaction.amount;
        }
      }
    });
    
    return Object.keys(monthlyData).map(month => ({
      month,
      income: monthlyData[month].income,
      expense: monthlyData[month].expense,
    }));
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
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">A visual breakdown of your finances.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Income vs. Expense</CardTitle>
            <CardDescription>Monthly overview for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <Tooltip cursor={{fill: "hsl(var(--muted))"}} content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="income" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Income" />
                    <Bar dataKey="expense" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Spending distribution by category.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={{}} className="h-[350px] w-full max-w-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                        <Pie
                            data={expenseByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            innerRadius={80}
                            dataKey="value"
                            paddingAngle={2}
                            strokeWidth={0}
                        >
                            {expenseByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Legend
                          content={({ payload }) => (
                            <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-sm text-muted-foreground mt-4">
                              {payload?.map((entry, index) => (
                                <li key={`item-${index}`} className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                  <span>{entry.value}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
