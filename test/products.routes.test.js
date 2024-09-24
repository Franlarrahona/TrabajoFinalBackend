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

describe('Test Integración de Productos', function () {

// **Test Integration for Products:**

it('GET /api/products/ debe traer los productos', async function () {

try {

const { body } = await requester.get('/api/products/');

expect(body.error).to.be.undefined;

expect(body.payload).to.be.an('array');

} catch (error) {

console.error('Error fetching products:', error);

}

});

it('POST /api/products/ debe cargar un nuevo producto a la bbdd', async function () {

try {

const { body } = await requester

.post('/api/products/')

.send(testProduct);

expect(body.error).to.be.undefined;

expect(body.payload).to.be.an('object');

} catch (error) {

console.error('Error creating product:', error);

}

});

});