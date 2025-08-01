import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CACHE_INSTANCE } from '@app/common';
import { Cacheable } from 'cacheable';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_INSTANCE) private readonly redisCache: Cacheable,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { variants, ...product } = createProductDto;

    const newProduct = await this.prismaService.product.create({
      data: {
        ...product,
        variants: {
          createMany: {
            data: variants,
          },
        },
      },
      include: { variants: true },
    });

    const cacheKey = `product:${newProduct.id}`;
    await this.redisCache.set(cacheKey, newProduct);
    return newProduct;
  }

  findAll() {
    return this.prismaService.product.findMany({
      include: { variants: true },
    });
  }

  async findOne(id: string) {
    const cacheKey = `product:${id}`;
    const cachedProduct = await this.redisCache.get(cacheKey);
    console.log('Finding product');

    if (!cachedProduct) {
      console.log('Product not cached');

      const product = await this.prismaService.product.findUniqueOrThrow({
        where: { id },
        include: { variants: true },
      });
      await this.redisCache.set(cacheKey, product);
      return product;
    }

    return cachedProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
      include: { variants: true },
    });

    const cacheKey = `product:${id}`;
    await this.redisCache.set(cacheKey, updatedProduct);

    return updatedProduct;
  }

  async remove(id: string) {
    const deletedProduct = await this.prismaService.$transaction(async (tx) => {
      const variantsToDelete = await tx.variant.findMany({
        where: { productId: id },
      });

      await tx.variant.deleteMany({
        where: { productId: id },
      });

      const deletedProduct = await tx.product.delete({
        where: { id },
        include: { variants: true },
      });

      deletedProduct.variants = variantsToDelete;
      return deletedProduct;
    });

    const cacheKey = `product:${id}`;
    await this.redisCache.delete(cacheKey);

    return deletedProduct;
  }
}
