const express = require('express');
const router = express.Router();
const {authorize} = require('../middleware/auth');
const accountController = require('../controllers/accountController');

router.get('/', accountController.getAccounts);
router.post('/', accountController.createAccount);
router.put('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

router.get('/all', authorize('admin'), accountController.getAllAccounts)
router.get('/:id/balance', accountController.getBalance);
router.get('/:id', accountController.getTransactions);

module.exports = router;
