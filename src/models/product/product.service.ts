import { Injectable, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Product from './product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }
    findAll(): Promise<Product[]> {
        return this.productsRepository.find();
    }

    async findOne(id: number): Promise<Product | undefined> {
        return await this.productsRepository.findOne({ where: { id } });
    }

    createOrUpdate(product: Product): Promise<Product> {
        return this.productsRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        await this.productsRepository.delete(id);
        }
        
}
