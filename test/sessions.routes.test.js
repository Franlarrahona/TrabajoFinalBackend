import * as chai from 'chai';

import supertest from 'supertest';

const expect = chai.expect;

const requester = supertest('http://localhost:8080');
const testUser = {

first_name: 'pedro',

last_name: 'perez',

email: 'pedro.perez@hotmail.com',

password: '1234'

};

const testProduct = {

nombre: 'producto de prueba',

categoria: 'categoria de producto de prueba',

precio: 99,

descripcion: 'descripcion de producto de prueba',

stock: 999

};
const cookie = {}


describe('Test integracion de sessions', function(){
    it('POST /api/sessions/register debe poder registrar un nuevo usuario', async function() {
        try{
        const {body} = (await requester.post('/api/sessions/register')).setEncoding(testUser);
        
        expect(body.error).to.be.undefined;
        expect(body.payload).to.be.ok;
        }catch(error){
            console.error('error : user registration error', error);
        }
    });
    it('POST /api/sessions/login debe poder logear el usuario correctamente', async function() {
        try{
            const result = (await requester.post('/api/sessions/login')).setEncoding(testUser);
            const cookieData = result.headers['set-cookie'][0];
            cookie = {name: cookieData.split('=')[0], value: cookieData.split('=')[1]};
    
            expect(cookieData).to.be.ok;
            expect(cookie.name).to.be.equals('coderCookie');
            expect(cookie.value).to.be.ok  
        }catch(error){
            console.error('error : error logging in user', error);
        }

    });

})
