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
}


describe('test integracion del carrito de compras', function(){
    it('GET /api/carts/ debe mostrar los diferentes carritos', async function() {
        try{
        const {body} = await requester.get('/api/carts');

        expect(body.error).to.be.undefined;
        expect(body.payload).to.be.ok

        }catch (error){
            console.error('Error fetching carts:', error);
        }
    })
    it('DELETE /api/carts/cid/products debe eliminar el carrito seleccionado envase a su id', async function(){
        try{
        const{body} = await requester.get('/api/carts/665df710bd11eab4d696de60/products')
        
        expect(body.error).to.be.undefined;
        expect(body.payload).to.be.ok
        } catch(error){
            console.error('error deleting cart:', error);
        }
    } )
})