import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { ProductsService } from './models/product/product.service';
import Product from './models/product/product.entity';
import { response } from 'express';
@Controller('/products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) { }


    @Get('/')
    @Render('products/index')
    async index() {
        const viewData = [];
        viewData['title'] = 'Products - Online Store';
        viewData['subtitle'] = 'List of products';
        viewData['products'] = await this.productsService.findAll();

        return {
            viewData: viewData,
        };
    }

    //redirecct kullanınca yönlendirme yapacağı rotada tekrar render çakışması olmasın diye render yerine res kullandı
    @Get('/:id')
    async show( @Param() params, @Res() response) {
        const product = await this.productsService.findOne(params.id);
        if (!product)
            return response.redirect('/products');

        const viewData = [];
        viewData['title'] = product.getName() + ' - Online Store';
        viewData['subtitle'] = product.getName() + ' - Product Information';
        viewData['product'] = product;

        return response.render('products/show', {
            viewData: viewData,
        });
    }
}