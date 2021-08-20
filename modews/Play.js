const { Schema, model } = require('mongoose');


const schema = new Schema({
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    usersLiked: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = model('Play', schema);