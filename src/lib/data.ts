import {
  Landmark,
  PiggyBank,
  Receipt,
  ShoppingBasket,
  Car,
  Home,
  UtensilsCrossed,
  type LucideProps,
  Bitcoin,
  Gift,
  Film,
  Plane,
  Heart,
  GraduationCap,
  Briefcase,
  BookOpen
} from 'lucide-react';
import type { Tag, Transaction } from '@/lib/types';

export const tags: Tag[] = [
  // Income
  { id: 'tag-1', name: 'Salary', icon: PiggyBank, type: 'income', color: 'text-emerald-500' },
  { id: 'tag-2', name: 'Freelance', icon: Briefcase, type: 'income', color: 'text-sky-500' },
  { id: 'tag-10', name: 'Investment', icon: Bitcoin, type: 'income', color: 'text-amber-500' },
  { id: 'tag-11', name: 'Gift', icon: Gift, type: 'income', color: 'text-pink-500' },
  
  // Expense
  { id: 'tag-3', name: 'Groceries', icon: ShoppingBasket, type: 'expense', color: 'text-orange-500' },
  { id: 'tag-4', name: 'Bills', icon: Receipt, type: 'expense', color: 'text-indigo-500' },
  { id: 'tag-5', name: 'Transport', icon: Car, type: 'expense', color: 'text-cyan-500' },
  { id: 'tag-6', name: 'Rent', icon: Home, type: 'expense', color: 'text-rose-500' },
  { id: 'tag-7', 'name': 'Dining Out', icon: UtensilsCrossed, type: 'expense', color: 'text-yellow-500' },
  { id: 'tag-8', name: 'Entertainment', icon: Film, type: 'expense', color: 'text-purple-500' },
  { id: 'tag-9', name: 'Travel', icon: Plane, type: 'expense', color: 'text-blue-500' },
  { id: 'tag-12', name: 'Health', icon: Heart, type: 'expense', color: 'text-red-500' },
  { id: 'tag-13', name: 'Education', icon: GraduationCap, type: 'expense', color: 'text-lime-500' },
  { id: 'tag-14', name: 'Books', icon: BookOpen, type: 'expense', color: 'text-teal-500' },
];

export const transactions: Transaction[] = [
  {
    id: 'txn-1',
    amount: 5000,
    date: new Date(new Date().setDate(1)),
    notes: 'Monthly salary',
    type: 'income',
    tagId: 'tag-1',
  },
  {
    id: 'txn-2',
    amount: 75.5,
    date: new Date(new Date().setDate(2)),
    notes: 'Weekly groceries',
    type: 'expense',
    tagId: 'tag-3',
  },
  {
    id: 'txn-3',
    amount: 1200,
    date: new Date(new Date().setDate(1)),
    notes: 'Monthly rent',
    type: 'expense',
    tagId: 'tag-6',
  },
  {
    id: 'txn-4',
    amount: 50,
    date: new Date(new Date().setDate(3)),
    notes: 'Gasoline',
    type: 'expense',
    tagId: 'tag-5',
  },
  {
    id: 'txn-5',
    amount: 45.2,
    date: new Date(),
    notes: 'Dinner with friends',
    type: 'expense',
    tagId: 'tag-7',
  },
  {
    id: 'txn-6',
    amount: 500,
    date: new Date(new Date().setDate(15)),
    notes: 'Project A payment',
    type: 'income',
    tagId: 'tag-2',
  },
    {
    id: 'txn-7',
    amount: 112.3,
    date: new Date(),
    notes: 'Electricity bill',
    type: 'expense',
    tagId: 'tag-4',
  },
   {
    id: 'txn-8',
    amount: 25,
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    notes: 'Lunch',
    type: 'expense',
    tagId: 'tag-7',
  },
];