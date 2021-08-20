const { isUser } = require('../middlewears/guards');
const { body, validationResult } = require('express-validator');
const router = require('express').Router();

router.get('/create', isUser(), (req, res) => {
    res.render('play/create');
});

router.post('/create', isUser(),
    body('title')
        .notEmpty().withMessage('Title is required!').bail(),
    body('description')
        .notEmpty().withMessage('Description is required!').bail()
        .isLength({ max: 50 }).withMessage('Description max length is 50 symbols!'),
    body('imageUrl')
        .notEmpty().withMessage('Image URL is required!'),

    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            req.body.isPublic = Boolean(req.body.isPublic);
            req.body.author = req.user._id;

            if (errors.length > 0) {
                throw new Error(errors.map(err => err.msg).join('\n'));
            }
            await req.storage.createPlay(req.body);
            res.redirect('/');
        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                play: {
                    title: req.body.title,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl,
                    isPublic: Boolean(req.body.isPublic)
                }
            }
            res.render('play/create', ctx);
        }
    });

router.get('/details/:id', async (req, res) => {
    try {
        const play = await req.storage.getOnePlay(req.params.id);

        if (req.user) {
            play.haveUser = req.user._id;
            play.isAuthor = req.user._id == play.author;
            play.isLiked = play.usersLiked.find(u => u._id == req.user._id);
        }

        res.render('play/details', { play });
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.get('/like/:id', isUser(), async (req, res) => {
    try {
        const play = await req.storage.getOnePlay(req.params.id);

        const alreadyLiked = play.usersLiked.find(u => u._id == req.user._id);

        if (alreadyLiked) {
            throw new Error('You can\'t like a Play twice!');
        }

        await req.storage.likePlay(req.user._id, req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        res.redirect(`/play/details/${req.params.id}`);
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        const play = await req.storage.getOnePlay(req.params.id);

        if (req.user._id != play.author) {
            throw new Error('Only the aouthor can delete this play!');
        }

        await req.storage.deletePlay(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        res.redirect(`/play/details/${req.params.id}`);
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const play = await req.storage.getOnePlay(req.params.id);

        if (req.user._id != play.author) {
            throw new Error('Only the author can edit this play!');
        }

        res.render('play/edit', { play });
    } catch (err) {
        console.log(err.message);
        res.redirect(`/play/details/${req.params.id}`);
    }
});

router.post('/edit/:id', isUser(),
    body('title')
        .notEmpty().withMessage('Title is required!').bail(),
    body('description')
        .notEmpty().withMessage('Description is required!').bail()
        .isLength({ max: 50 }).withMessage('Description max length is 50 symbols!'),
    body('imageUrl')
        .notEmpty().withMessage('Image URL is required!'),

    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            const play = await req.storage.getOnePlay(req.params.id);

            if (req.user._id != play.author) {
                throw new Error('Only the author can edit this play!');
            }
            req.body.isPublic = Boolean(req.body.isPublic);

            await req.storage.editPlay(req.params.id, req.body);
            res.redirect(`/play/details/${req.params.id}`);

        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                play: {
                    _id: req.params.id,                    
                    title: req.body.title,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl,
                }
            }
            res.render('play/edit', ctx);
        }
    });

module.exports = router;