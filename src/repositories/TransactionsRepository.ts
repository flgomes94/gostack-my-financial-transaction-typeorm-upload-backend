import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();
    const incomeTransactionsValue = allTransactions.reduce((acc, cur) => {
      return cur.type === 'income' ? acc + Number(cur.value) : acc;
    }, 0);
    const outcomeTransactionsValue = allTransactions.reduce((acc, cur) => {
      return cur.type === 'outcome' ? acc + Number(cur.value) : acc;
    }, 0);
    const balance: Balance = {
      income: incomeTransactionsValue,
      outcome: outcomeTransactionsValue,
      total: incomeTransactionsValue - outcomeTransactionsValue,
    };
    return balance;
  }
}

export default TransactionsRepository;
