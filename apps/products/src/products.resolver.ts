import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { ProductModel } from './models/product.model';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Resolver(() => ProductModel)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => ProductModel)
  createProduct(
    @Args('createProductInput') createProductinput: CreateProductDto,
  ) {
    return this.productsService.create(createProductinput);
  }

  @Query(() => [ProductModel], { name: 'products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Query(() => ProductModel, { name: 'product' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.productsService.findOne(id);
  }

  @Mutation(() => ProductModel)
  update(
    @Args('id', { type: () => String }) id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductInput);
  }

  @Mutation(() => ProductModel)
  remove(@Args('id', { type: () => String }) id: string) {
    return this.productsService.remove(id);
  }
}
