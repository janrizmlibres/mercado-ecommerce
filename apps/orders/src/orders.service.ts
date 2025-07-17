import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  create(createOrderDto: CreateOrderDto) {
    const orderData = {
      ...createOrderDto,
      timestamp: new Date(),
      userId: '123',
    };
    console.log(
      'Creating order with data:',
      JSON.stringify(orderData, null, 2),
    );
    return this.ordersRepository.create(orderData);
  }

  findAll() {
    return this.ordersRepository.find({});
  }

  findOne(_id: string) {
    return this.ordersRepository.findOne({ _id });
  }

  update(_id: string, updateOrderDto: UpdateOrderDto) {
    return this.ordersRepository.findOneAndUpdate(
      { _id },
      { $set: updateOrderDto },
    );
  }

  remove(_id: string) {
    return this.ordersRepository.findOneAndDelete({ _id });
  }
}
