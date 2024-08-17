const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/auth');
const { check } = require('express-validator');

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operations related to user authentication
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user and encrypt the password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/register', [
  check('name').notEmpty(),
  check('password').notEmpty().isLength({ min: 8 }),
  check('email').notEmpty().isEmail()
], register);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     description: Authenticate a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns a token
 *       400:
 *         description: Invalid credentials or user not found
 *       500:
 *         description: Server error
 */
router.post('/login', login);

module.exports = router;
