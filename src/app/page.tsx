"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Download, ArrowRight, Wallet } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { transactions as initialTransactions, tags } from "@/lib/data";
import type { Transaction, TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Please select a transaction type.",
  }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  tagId: z.string().min(1, { message: "Please select a category." }),
  date: z.date({ required_error: "A date is required." }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DashboardPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const { toast } = useToast();

  const sortedTransactions = React.useMemo(() => {
    return [...transactions].sort((a,b) => b.date.getTime() - a.date.getTime());
  }, [transactions]);
  
  const totalIncome = React.useMemo(() => {
    return transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  }, [transactions]);

  const totalExpense = React.useMemo(() => {
    return transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  }, [transactions]);

  const balance = React.useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      notes: "",
      date: new Date(),
    },
  });

  const watchType = form.watch("type");

  function onSubmit(values: FormValues) {
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      ...values,
      notes: values.notes || "",
    };
    setTransactions((prev) => [...prev, newTransaction]);
    toast({
      title: "Success",
      description: "Transaction added successfully.",
    });
    setDialogOpen(false);
    form.reset({
      type: "expense",
      amount: 0,
      notes: "",
      date: new Date(),
    });
  }

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
    const tag = tags.find((t) => t.id === transaction.tagId);
    if (!tag) return null;
    const Icon = tag.icon;
    return (
      <div className="flex items-center p-3 hover:bg-muted/50 rounded-lg transition-colors -mx-3">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-muted p-2 rounded-full">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{tag.name}</p>
            <p className="text-sm text-muted-foreground">{transaction.notes}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn(
            "font-semibold text-base",
            transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500 dark:text-red-400',
          )}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">{format(transaction.date, "PP")}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
       <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your financial dashboard.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>
                  Add a new income or expense to your records.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-muted-foreground sm:text-sm">$</span>
                            </div>
                            <Input type="number" placeholder="0.00" {...field} className="pl-7" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    <FormField
                    control={form.control}
                    name="tagId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tags.filter(t => t.type === watchType).map(tag => (
                              <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Transaction details..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Save Transaction</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-8 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
               <span className="text-emerald-500"><Wallet className="h-4 w-4 text-muted-foreground" /></span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">+${totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Across all transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
               <span className="text-red-500 dark:text-red-400"><Wallet className="h-4 w-4 text-muted-foreground" /></span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500 dark:text-red-400">-${totalExpense.toFixed(2)}</div>
               <p className="text-xs text-muted-foreground">Across all transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold",
                 balance >= 0 ? "text-primary" : "text-destructive"
              )}>${balance.toFixed(2)}</div>
               <p className="text-xs text-muted-foreground">Current available balance</p>
            </CardContent>
          </Card>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
              {sortedTransactions.length > 0 ? (
                  <div className="divide-y divide-border">
                      {sortedTransactions.map(t => <TransactionItem key={t.id} transaction={t} />)}
                  </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">No transactions yet.</p>
                  <p className="text-sm">Start by adding your first income or expense.</p>
                </div>
              )}
          </CardContent>
      </Card>
    </div>
  );
}
