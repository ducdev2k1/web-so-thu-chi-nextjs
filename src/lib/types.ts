import type { LucideProps } from 'lucide-react';
import React from 'react';

export type TransactionType = 'income' | 'expense';

export type Tag = {
  id: string;
  name: string;
  icon: React.ComponentType<LucideProps>;
  type: TransactionType | 'all';
};

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  notes: string;
  type: TransactionType;
  tagId: string;
}
