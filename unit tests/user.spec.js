
'use strict'

const Accounts = require('../models/user.js')

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('deyan','deyan@gmail.com', 'password','img.jpg')
		expect(register).toEqual({
			authorised: true,
			user: {
				id: 1,
				user: 'deyan',
				email: 'deyan@gmail.com',
				avatar: 'img.jpg'
			}
		})
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('deyan','deyan@gmail.com', 'password','img.jpg')
		await expect( account.register('deyan','deyan@gmail.com', 'password','img.jpg') )
			.rejects.toEqual( Error('username "deyan" already in use') )
		done()
	})

})

describe('regCheck()', () => {
	test('no username for register details', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.regCheck('','deyan@gmail.com', 'password','img.jpg') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('no email for register details', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.regCheck('deyan','', '123456','img.jpg') )
			.rejects.toEqual( Error('missing email') )
		done()
	})

	test('no password for register details', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.regCheck('deyan','deyan@gmail.com', '','img.jpg') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

	test('no avatar for register details', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.regCheck('deyan','deyan@gmail.com', 'password','') )
			.rejects.toEqual( Error('missing avatar') )
		done()
	})

	test('valid register details', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const img = await account.regCheck('deyan','deyan@gmail.com', 'password','img.jpg')
		expect( img ).toBe(true)
		done()
	})
})

describe('uploadPicture()', () => {
	test('no image name when registering user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('deyan','deyan@gmail.com','password','avatar.png')
		const avatarUpload = await account.uploadPicture('C:/laragon/www/bozhilo2/public/assets', 'image/png', 'deyan')
		await expect( avatarUpload ).toEqual( `./avatars/avatar_deyan.png`)
		done()
	})

	test('no image name when registering user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.uploadPicture('', 'image/png') )
			.rejects.toEqual( Error('missing file name') )
		done()
	})

	test('no image name when registering user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.uploadPicture('photo', '') )
			.rejects.toEqual( Error('missing file extension') )
		done()
	})
})

describe('login()', () => {
	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('deyan','deyan@gmail.com', 'password','img.jpg')
		const valid = await account.login('deyan', 'password')
		expect(valid).toEqual({
			authorised: true,
			user: {
				id: 1,
				user: 'deyan',
				email: 'deyan@gmail.com',
				avatar: 'img.jpg'
			}
		})
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('deyan','deyan@gmail.com', 'password','img.jpg')
		await expect( account.login('dodo', 'password') )
			.rejects.toEqual( Error('username "dodo" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('deyan','deyan@gmail.com', 'password','img.jpg')
		await expect( account.login('deyan', 'lol') )
			.rejects.toEqual( Error('invalid password for account "deyan"') )
		done()
	})

})

describe('getById()', () => {
	test('get user with valid id', async done => {
		expect.anything()
		const account = await new Accounts()
		await account.register('deyan','deyan@gmail.com', 'password','img.jpg')
		const valid = await account.getById(1)
		expect(valid).toEqual({
			id: 1,
			user: 'deyan',
			email: 'deyan@gmail.com',
			avatar: 'img.jpg'
		})
		done()
	})

	test('get user with invalid id', async done => {
		expect.anything()
		const account = await new Accounts()
		await account.register('deyan','deyan@gmail.com', 'password','img.jpg')
		await expect( account.getById(10) )
			.rejects.toEqual( Error('user not found') )
		done()
	})
})
