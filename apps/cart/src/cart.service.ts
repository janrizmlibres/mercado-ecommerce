import { CACHE_INSTANCE, UserDto } from '@app/common';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartModel } from './models/cart.model';
import { randomUUID } from 'crypto';
import { CartVariantDto } from './dto/cart-variant.dto';

@Injectable()
export class CartService {
  constructor(@Inject(CACHE_INSTANCE) private readonly redis: Cacheable) {}

  async createItem({ id }: UserDto, createCartItemDto: CreateCartItemDto) {
    const cacheKey = `cart:${id}`;
    const cart = await this.findCart(cacheKey);

    const { productId, variants, quantity } = createCartItemDto;

    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].productId !== productId) continue;
      if (!this.variantsEqual(cart.items[i].variants, variants)) continue;

      cart.items[i].quantity += quantity;
      await this.redis.set(cacheKey, cart);
      return cart;
    }

    cart.items.push({
      id: randomUUID(),
      ...createCartItemDto,
    });

    await this.redis.set(cacheKey, cart);
    return cart;
  }

  private variantsEqual(arr1: CartVariantDto[], arr2: CartVariantDto[]) {
    const map1 = new Map(arr1.map(({ name, value }) => [name, value]));
    const map2 = new Map(arr2.map(({ name, value }) => [name, value]));

    for (const [name, value] of map1) {
      if (map2.get(name) !== value) return false;
    }

    return true;
  }

  async find({ id }: UserDto) {
    const cacheKey = `cart:${id}`;

    try {
      return await this.findCart(cacheKey);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }

      const cart = {
        userId: id,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.redis.set(cacheKey, cart);
      return cart;
    }
  }

  private async findCart(key: string) {
    const cachedCart = await this.redis.get<CartModel>(key);

    if (!cachedCart) {
      throw new NotFoundException('Cart not found');
    }

    return cachedCart;
  }

  async updateItem(
    id: string,
    { id: userId }: UserDto,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const cacheKey = `cart:${userId}`;
    const cart = await this.findCart(cacheKey);

    const itemIdx = cart.items.findIndex((item) => item.id === id);
    if (itemIdx === -1) throw new NotFoundException('Cart item not found');

    const item = cart.items[itemIdx];
    item.quantity += updateCartItemDto.change;

    if (item.quantity <= 0) {
      cart.items.splice(itemIdx, 1);
    } else {
      cart.items[itemIdx] = item;
    }

    await this.redis.set(cacheKey, cart);
    return item;
  }

  async removeItem(id: string, { id: userId }: UserDto) {
    const cacheKey = `cart:${userId}`;
    const cart = await this.findCart(cacheKey);

    cart.items = cart.items.filter((item) => item.id !== id);
    await this.redis.set(cacheKey, cart);
    return cart;
  }
}
