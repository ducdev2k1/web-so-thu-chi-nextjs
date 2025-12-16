"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Download } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TransactionType>("expense");

  const { toast } = useToast();

  const dayTransactions = React.useMemo(() => {
    return transactions.filter(
      (t) => date && format(t.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  }, [transactions, date]);

  const incomeTransactions = dayTransactions.filter((t) => t.type === "income");
  const expenseTransactions = dayTransactions.filter((t) => t.type === "expense");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      notes: "",
    },
  });

  const watchType = form.watch("type");

  function onSubmit(values: FormValues) {
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      ...values,
      notes: values.notes || "",
    };
    setTransactions((prev) => [...prev, newTransaction].sort((a,b) => b.date.getTime() - a.date.getTime()));
    toast({
      title: "Success",
      description: "Transaction added successfully.",
    });
    setDialogOpen(false);
    form.reset();
  }

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
    const tag = tags.find((t) => t.id === transaction.tagId);
    if (!tag) return null;
    const Icon = tag.icon;
    return (
      <div className="c-transaction-item flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="bg-muted p-2 rounded-full">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{tag.name}</p>
            <p className="text-sm text-muted-foreground">{transaction.notes}</p>
          </div>
        </div>
        <p className={cn(
          "font-semibold",
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600',
          'dark:text-green-400 dark:text-red-400'
        )}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </p>
      </div>
    );
  };
  
  return (
    <div className="p-dashboard container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Calendar</CardTitle>
               <div className="c-calendar-controls flex items-center gap-2">
                 <Button variant="outline" size="sm" disabled>Day</Button>
                 <Button variant="outline" size="sm" disabled>Week</Button>
                 <Button variant="ghost" size="sm">Month</Button>
                 <Button variant="outline" size="sm" disabled>Year</Button>
               </div>
            </CardHeader>
            <CardContent className="c-calendar flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Transaction
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
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
                                    <Input type="number" placeholder="0.00" {...field} />
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
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Download className="mr-2 h-4 w-4" />
                      Export Data (CSV)
                    </Button>
                     <Button variant="outline" className="w-full justify-start" disabled>
                      <Download className="mr-2 h-4 w-4" />
                      Export Data (PDF)
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            Transactions for {date ? format(date, "PPP") : "today"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TransactionType)} className="c-transaction-tabs w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
            <TabsContent value="expense">
               <div className="c-transaction-list space-y-2 mt-4">
                 {expenseTransactions.length > 0 ? (
                    expenseTransactions.map(t => <TransactionItem key={t.id} transaction={t} />)
                 ) : <p className="text-muted-foreground text-center p-4">No expenses for this day.</p>}
               </div>
            </TabsContent>
            <TabsContent value="income">
              <div className="c-transaction-list space-y-2 mt-4">
                 {incomeTransactions.length > 0 ? (
                    incomeTransactions.map(t => <TransactionItem key={t.id} transaction={t} />)
                 ) : <p className="text-muted-foreground text-center p-4">No income for this day.</p>}
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

    </div>
  );
}
