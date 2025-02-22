import { Controller, Get, Render, Post, Redirect, Body, Req, Res } from '@nestjs/common';
import { User } from 'src/models/user/user.entity';
import { UsersService } from '../models/user/users.service';


@Controller('/auth')
export class AuthController {

    constructor(private readonly usersService: UsersService) { }

    @Get('/register')
    @Render('auth/register')
    register() {
        const viewData = [];
        viewData['title'] = 'User Register - Online Store';
        viewData['subtitle'] = 'User Register';
        return {
            viewData: viewData,
        };
    }


    @Post('/store')
    @Redirect('/')
    async store(@Body() body) {
        const newUser = new User();
        newUser.setName(body.name);
        newUser.setPassword(body.password);
        newUser.setEmail(body.email);
        newUser.setRole('client');
        newUser.setBalance(1000);
        await this.usersService.createOrUpdate(newUser);
    }

    @Get('/login')
    @Render('auth/login')
    login() {
        const viewData = [];
        viewData['title'] = 'User Login - Online Store';
        viewData['subtitle'] = 'User Login';
        return {
            viewData: viewData,
        };
    }

    
    @Post('/connect')
    async connect(@Body() body, @Req() request, @Res() response) {
        const email = body.email;
        const pass = body.password;
        const user = await this.usersService.login(email, pass);
        if (user) {
            request.session.user = {
                id: user.getId(),
                name: user.getName(),
                role: user.getRole(),
            };
            return response.redirect('/');
        } else {
            return response.redirect('/auth/login');
        }
    }


    @Get('/logout')
    @Redirect('/')
    logout(@Req() request) {
        request.session.user = null;
    }

}
