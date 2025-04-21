const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    owner: {type: String},
    bank: {type: String},
    number: {type: Number},
    card: {type: Number},
    sheba: {type: Number},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
