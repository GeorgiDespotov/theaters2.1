const Play = require('../modews/Play');
const User = require('../modews/User');


async function getOnePlay(id) {
    const play = await Play.findById(id).populate('usersLiked').lean();

    return play;
}

async function getAllPlays(sortBy) {
    let sort = { usersLiked: -1 };
    if (sortBy != 'likes') {
        
        sort = { createdAt: -1 }
    }
    return Play.find({ isPublic: true }).sort(sort).lean();
}

async function createPlay(playData) {
    const existingPlay = await Play.findOne({ title: playData.title });
    
    if (existingPlay) {
        throw new Error('A play with this name already exist!');
    }

    const play = new Play(playData);

    await play.save();

    return play;
}

async function likePlay(userId, playId) {
    const play = await Play.findById(playId);
    const user = await User.findById(userId);

    play.usersLiked.push(userId);
    user.likedPlays.push(playId);

    await play.save();
    await user.save();

    return play;
}

async function deletePlay(id) {
    return Play.findByIdAndDelete(id);
}

async function editPlay(playId, playData) {
    const play = await Play.findById(playId);

    play.title = playData.title;
    play.description = playData.description;
    play.imageUrl = playData.imageUrl;
    play.isPublic = Boolean(playData.isPublic);

    await play.save();

    return play;
}

module.exports = {
    getAllPlays,
    createPlay,
    getOnePlay,
    likePlay,
    deletePlay,
    editPlay
}