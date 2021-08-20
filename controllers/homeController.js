const router = require('express').Router();

router.get('/', async (req, res) => {
    const plays = await req.storage.getAllPlays(req.query.sortBy);
    
    res.render('home/home', { plays });
});


module.exports = router;