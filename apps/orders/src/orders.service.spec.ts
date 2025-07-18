import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { OrderStatus } from './types/order.types';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: jest.Mocked<OrdersRepository>;

  const mockOrderItems: OrderItemDto[] = [
    {
      productId: 'prod-1',
      quantity: 2,
      price: 50,
    },
    {
      productId: 'prod-2',
      quantity: 1,
      price: 100,
    },
  ];

  const mockOrder = {
    _id: new Types.ObjectId(),
    userId: '123',
    status: OrderStatus.PENDING,
    totalPrice: 100,
    orderItems: mockOrderItems,
    invoiceId: 'inv-123',
    timestamp: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get(OrdersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order with timestamp and userId', async () => {
      const createOrderDto: CreateOrderDto = {
        status: OrderStatus.PENDING,
        totalPrice: 100,
        orderItems: mockOrderItems,
        invoiceId: 'inv-123',
      };

      const expectedOrder = {
        ...createOrderDto,
        userId: '123',
        timestamp: expect.any(Date) as Date,
      };

      repository.create.mockResolvedValue(mockOrder);

      const result = await service.create(createOrderDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.create).toHaveBeenCalledWith(expectedOrder);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [mockOrder];
      repository.find.mockResolvedValue(orders);

      const result = await service.findAll();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.find).toHaveBeenCalledWith({});
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return a single order by id', async () => {
      const orderId = '507f1f77cf86cd799439011';
      repository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(orderId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({ _id: orderId });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderId = '507f1f77cf86cd799439011';
      repository.findOne.mockRejectedValue(
        new NotFoundException('Document was not found'),
      );

      await expect(service.findOne(orderId)).rejects.toThrow(NotFoundException);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({ _id: orderId });
    });
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      const orderId = '507f1f77cf86cd799439011';
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.PAID,
        totalPrice: 150,
      };

      const updatedOrder = { ...mockOrder, ...updateOrderDto };
      repository.findOneAndUpdate.mockResolvedValue(updatedOrder);

      const result = await service.update(orderId, updateOrderDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: orderId },
        { $set: updateOrderDto },
      );
      expect(result).toEqual(updatedOrder);
    });

    it('should throw NotFoundException when order not found during update', async () => {
      const orderId = '507f1f77cf86cd799439011';
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.PAID,
      };

      repository.findOneAndUpdate.mockRejectedValue(
        new NotFoundException('Document was not found'),
      );

      await expect(service.update(orderId, updateOrderDto)).rejects.toThrow(
        NotFoundException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: orderId },
        { $set: updateOrderDto },
      );
    });

    it('should handle partial updates correctly', async () => {
      const orderId = '507f1f77cf86cd799439011';
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.SHIPPED,
      };

      const updatedOrder = { ...mockOrder, status: OrderStatus.SHIPPED };
      repository.findOneAndUpdate.mockResolvedValue(updatedOrder);

      const result = await service.update(orderId, updateOrderDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: orderId },
        { $set: updateOrderDto },
      );
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('remove', () => {
    it('should delete an order successfully', async () => {
      const orderId = '507f1f77cf86cd799439011';
      repository.findOneAndDelete.mockResolvedValue(mockOrder);

      const result = await service.remove(orderId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOneAndDelete).toHaveBeenCalledWith({
        _id: orderId,
      });
      expect(result).toEqual(mockOrder);
    });

    it('should return null when order not found during deletion', async () => {
      const orderId = '507f1f77cf86cd799439011';
      repository.findOneAndDelete.mockResolvedValue(null);

      const result = await service.remove(orderId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOneAndDelete).toHaveBeenCalledWith({
        _id: orderId,
      });
      expect(result).toBeNull();
    });
  });
});
