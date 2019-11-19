
'use strict'

const Accounts = require('../models/user.js')

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('deyan', 'password','img.jpg')
		expect(register).toEqual({
			authorised: true,
			user: {
				id: 1,
				user: 'deyan',
				avatar: 'img.jpg'
			}
		})
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('deyan', 'password','img.jpg')
		await expect( account.register('deyan', 'password','img.jpg') )
			.rejects.toEqual( Error('username "deyan" already in use') )
		done()
	})

})

describe('regCheck()', () => {
	test('no username for register details', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.regCheck('', 'password', 'img.jpg') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('no password for register details', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.regCheck('dodo', '', 'img.jpg') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

	test('no avatar for register details', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.regCheck('dodo', 'password', '') )
			.rejects.toEqual( Error('missing avatar') )
		done()
	})

	test('valid register details', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const img = await account.regCheck('dodo', 'password', 'img.jpg')
		expect( img ).toBe(true)
		done()
	})
})

describe('uploadPicture()', () => {
	// this would have to be done by mocking the file system
	// perhaps using mock-fs?
})

describe('login()', () => {
	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('deyan', 'password', 'img.jpg')
		const valid = await account.login('deyan', 'password')
		expect(valid).toEqual({
			authorised: true,
			user: {
				id: 1,
				user: 'deyan',
				avatar: 'img.jpg'
			}
		})
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'img.jpg')
		await expect( account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'img.jpg')
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})

describe('getById()', () => {
	test('get user with valid id', async done => {
		expect.anything()
		const account = await new Accounts()
		await account.register('deyan', 'password', 'img.jpg')
		const valid = await account.getById(1)
		expect(valid).toEqual({
			id: 1,
			user: 'deyan',
			avatar: 'img.jpg'
		})
		done()
	})

	test('get user with invalid id', async done => {
		expect.anything()
		const account = await new Accounts()
		await account.register('deyan', 'password', 'img.jpg')
		await expect( account.getById(10) )
			.rejects.toEqual( Error('user not found') )
		done()
	})
})
