const express = require('express');
const { read, list, create, update, remove } = require('../Controllers/product');
const { auth, checkAdmin, checkManager } = require('../Middleware/auth');
const { check } = require('express-validator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Operations related to products
 */

/**
 * @swagger
 * /product:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get list of products
 *     description: Retrieve all products
 *     security:
 *      - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *       404:
 *         description: No products found
 *       500:
 *         description: Server error
 */
router.get('/product', auth, checkManager, list);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a product by ID
 *     description: Retrieve a single product by its ID
 *     security:
 *      - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/product/:id', auth, checkManager, read);

/**
 * @swagger
 * /product:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     description: Add a new product to the database
 *     security:
 *      - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - detail
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               detail:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/product', [
  check('name').not().isEmpty(),
  check('detail').isLength({ min: 5 }),
  check('price').isNumeric()
], create);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product
 *     description: Modify an existing product by its ID
 *     security:
 *      - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               detail:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put('/product/:id', auth, checkAdmin, update);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product
 *     description: Remove a product by its ID
 *     security:
 *      - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete('/product/:id', auth, checkAdmin, remove);

module.exports = router;
