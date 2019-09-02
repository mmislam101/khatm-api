/* global server jwt */
'use strict';

// Load modules

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Server = require('../server');

const Constants = require('../lib/constants');

// Test shortcuts

const { describe, it, before } = exports.lab = Lab.script();
const { expect } = Code;

before(async () => {

    global.server = await Server.deployment();

    const session = await server.inject({
        method: 'post',
        url: '/sessions',
        payload: {
            uuid: 'test-uuid',
            email: 'x@y.com',
            firstName: 'test',
            platform: Constants.authPlatform.google
        }
    });

    global.jwt = session.result.jwt;
});

describe('Books', () => {

    it('get the quran.', async () => {

        const books = await server.inject({
            method: 'get',
            url: '/books',
            headers: {
                authorization: `Token ${jwt}`
            }
        });

        expect(books.statusCode).to.equal(200);
        expect(books.result[0].slug_id).to.equal('book-quran');
        expect(books.result[0].type).to.equal(Constants.bookType.quran);
    });
});
