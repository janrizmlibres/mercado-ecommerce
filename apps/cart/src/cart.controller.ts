import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @EventPattern('user_deleted')
  async handleUserDeleted(@Payload() data: { id: string }) {
    await this.cartService.removeUserCart(data.id);
  }

  @EventPattern('product_deleted')
  async handleProductDeleted(@Payload() data: { id: string }) {
    await this.cartService.removeProductFromAllCarts(data.id);
  }
}
