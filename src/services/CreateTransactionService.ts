import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && balance.total < value) {
      throw new AppError('No valid cash', 400);
    }
    const existsCategory = await categoriesRepository.findOne({
      where: { title: category },
    });
    const databaseCategory =
      existsCategory ||
      categoriesRepository.create({
        title: category,
      });

    await categoriesRepository.save(databaseCategory);
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: databaseCategory.id,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
