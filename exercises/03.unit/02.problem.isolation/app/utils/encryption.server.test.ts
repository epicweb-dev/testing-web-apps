import { faker } from '@faker-js/faker'
import { encrypt, decrypt } from './encryption.server'

// 🐨 create the variable to store the original value of process.env.ENCRYPTION_SECRET

// 🐨 add a beforeEach to store the original value of process.env.ENCRYPTION_SECRET
// 🐨 and set the process.env.ENCRYPTION_SECRET to a random string

// 🐨 add an afterEach to restore the original value of process.env.ENCRYPTION_SECRET

test('should encrypt and decrypt text correctly', () => {
	const originalText = 'Hello, World!'
	const encryptedText = encrypt(originalText)
	const decryptedText = decrypt(encryptedText)

	expect(decryptedText).toBe(originalText)
})

test('should throw an error when trying to decrypt invalid text', () => {
	const invalidText = faker.lorem.words(3)

	expect(() => decrypt(invalidText)).toThrowError('Invalid text.')
})

test('should produce different encrypted text for the same input', () => {
	const originalText = 'Hello, World!'
	const encryptedText1 = encrypt(originalText)
	const encryptedText2 = encrypt(originalText)

	expect(encryptedText1).not.toBe(encryptedText2)
})
