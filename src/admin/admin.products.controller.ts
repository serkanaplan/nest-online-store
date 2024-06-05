import { Body, Controller, Get, Param, Post, Redirect, Render, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { ProductsService } from '../models/product/product.service';
import Product from 'src/models/product/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductValidator } from 'src/validator/validator/product.validator';
import * as fs from 'fs';


@Controller('/admin/products')
export class AdminProductsController {
    constructor(private readonly productsService: ProductsService) { }
    @Get('/')
    @Render('admin/products/index')
    async index() {
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Online Store';
        viewData['products'] = await this.productsService.findAll();
        return {
            viewData: viewData,
        };
    }


    @Post('/store')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './public/uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
    }))
    @Redirect('/admin/products')
    async store(@Body() body, @UploadedFile() file: Express.Multer.File, @Req() request) {

        const toValidate: string[] = ['name', 'description', 'price', 'imageCreate'];
        const errors: string[] = ProductValidator.validate(body, file, toValidate);
        if (errors.length > 0) {
            if (file) {
                fs.unlinkSync(file.path);
            }
            request.session.flashError = errors;
        } else {
            const newProduct = new Product();
            newProduct.setName(body.name);
            newProduct.setDescription(body.description);
            newProduct.setPrice(body.price);
            newProduct.setImage(file.filename);
            await this.productsService.createOrUpdate(newProduct);
        }
    }

    @Get('/:id')
    @Render('admin/products/edit')
    async edit(@Param('id') id: number) {
        const viewData = [];
        viewData['title'] = 'Admin Page - Edit Product - Online Store';
        viewData['product'] = await this.productsService.findOne(id);
        return {
            viewData: viewData,
        };
    }


    @Post('/:id/update')
    @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
    @Redirect('/admin/products')
    async update(
        @Body() body,
        @UploadedFile() file: Express.Multer.File,
        @Param('id') id: number
    ) {
        const product = await this.productsService.findOne(id);
        product.setName(body.name);
        product.setDescription(body.description);
        product.setPrice(body.price);
        if (file) {
            product.setImage(file.filename);
        }
        await this.productsService.createOrUpdate(product);
    }


    @Post('/:id')
    @Redirect('/admin/products')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }

}
