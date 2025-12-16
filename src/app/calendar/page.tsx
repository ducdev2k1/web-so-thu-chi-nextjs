"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay, isToday } from "date-fns";
import { CalendarIcon, PlusCircle, ChevronLeft, ChevronRight, ShoppingBasket, Landmark } from "lucide-react";
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
import { transactions as initialTransactions, tags as initialTags } from "@/lib/data";
import type { Transaction, TransactionType, Tag } from "@/lib/types";
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

const TransactionItem = ({ transaction, tags }: { transaction: Transaction, tags: Tag[] }) => {
    const tag = tags.find((t) => t.id === transaction.tagId);
    if (!tag) return null;
    const Icon = tag.icon;
    return (
      <div className="flex items-center p-3 hover:bg-muted/50 rounded-lg transition-colors -mx-3">
        <div className="flex items-center gap-4 flex-1">
          <div className={cn("bg-muted p-2 rounded-full", tag.color && 'bg-opacity-20')}>
            <Icon className={cn("h-5 w-5 text-muted-foreground", tag.color)} />
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
        </div>
      </div>
    );
  };


export default function CalendarPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
  const [tags, setTags] = React.useState<Tag[]>(initialTags);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [activeDate, setActiveDate] = React.useState<Date | null>(new Date());
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      notes: "",
    },
  });
  
  const watchType = form.watch("type");

  const daysInMonth = React.useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const startingDayIndex = getDay(startOfMonth(currentMonth));

  const transactionsByDay = React.useMemo(() => {
    const grouped: { [key: string]: { income: number; expense: number; count: number } } = {};
    daysInMonth.forEach(day => {
      const dayKey = format(day, "yyyy-MM-dd");
      grouped[dayKey] = { income: 0, expense: 0, count: 0 };
    });

    transactions.forEach(t => {
      const dayKey = format(t.date, "yyyy-MM-dd");
      if (grouped[dayKey]) {
        if (t.type === 'income') {
          grouped[dayKey].income += t.amount;
        } else {
          grouped[dayKey].expense += t.amount;
        }
        grouped[dayKey].count += 1;
      }
    });
    return grouped;
  }, [daysInMonth, transactions]);

  const selectedDayTransactions = React.useMemo(() => {
    if (!activeDate) return [];
    return transactions.filter(t => isSameDay(t.date, activeDate)).sort((a,b) => b.date.getTime() - a.date.getTime());
  }, [transactions, activeDate]);

  function handleAddTransactionForDate(date: Date) {
    setActiveDate(date);
    form.reset({
      type: "expense",
      amount: 0,
      notes: "",
      date: date
    });
    setDialogOpen(true);
  }

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
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold w-48 text-center">{format(currentMonth, "MMMM yyyy")}</h2>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
           <Button onClick={() => handleAddTransactionForDate(activeDate || new Date())}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <div className="grid grid-cols-7 border-t border-l">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center font-semibold text-sm border-r border-b bg-muted/50">
              {day}
            </div>
          ))}

          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b"></div>
          ))}

          {daysInMonth.map(day => {
            const dayKey = format(day, "yyyy-MM-dd");
            const data = transactionsByDay[dayKey];
            const isSelected = activeDate && isSameDay(day, activeDate);
            
            return (
              <div
                key={day.toString()}
                className={cn(
                    "h-36 border-r border-b p-2 flex flex-col relative group cursor-pointer transition-colors",
                    isSelected ? "bg-muted" : "hover:bg-muted/50",
                    isToday(day) && !isSelected && "bg-blue-50 dark:bg-blue-900/10"
                )}
                onClick={() => setActiveDate(day)}
              >
                <time dateTime={dayKey} className={cn(
                    "font-semibold",
                    isToday(day) && "text-primary font-bold"
                )}>{format(day, "d")}</time>
                {data && data.count > 0 && (
                  <div className="mt-1 text-xs space-y-1 overflow-hidden">
                    {data.income > 0 && (
                      <div className="flex items-center gap-1 text-emerald-500 truncate">
                        <span className="font-semibold">+${data.income.toFixed(0)}</span>
                      </div>
                    )}
                    {data.expense > 0 && (
                       <div className="flex items-center gap-1 text-red-500 dark:text-red-400 truncate">
                        <span className="font-semibold">-${data.expense.toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                )}
                 <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleAddTransactionForDate(day)}>
                    <PlusCircle className="h-4 w-4"/>
                </Button>
              </div>
            );
          })}
        </div>

        {activeDate && (
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Transactions for {format(activeDate, "PPP")}</CardTitle>
                    <CardDescription>All income and expenses logged for this day.</CardDescription>
                </CardHeader>
                <CardContent>
                    {selectedDayTransactions.length > 0 ? (
                        <div className="divide-y divide-border -mx-3">
                            {selectedDayTransactions.map(t => <TransactionItem key={t.id} transaction={t} tags={tags} />)}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No transactions for this day.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              {activeDate ? `Adding a new transaction for ${format(activeDate, 'PPP')}` : 'Add a new income or expense.'}
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
    </>
  );
}