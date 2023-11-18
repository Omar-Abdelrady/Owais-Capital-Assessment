import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from 'src/entities/balance.entity';
import { Repository } from 'typeorm';
import { CreateBalanceDto } from './dto/createBalance';
import { User } from 'src/entities/user.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepo: Repository<Balance>,
  ) {}
  async create(createBalanceDto: CreateBalanceDto, user: User) {
    const balance = await this.balanceRepo.create(createBalanceDto);
    balance.user = user;
    return await this.balanceRepo.save(balance);
  }
}
