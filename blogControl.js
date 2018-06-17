const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// BlogPosts.create(<title>, <content>, <author>);
BlogPosts.create(
    'This is a test title #1',
    'Here is some content to display. \n It is good content!',
    'Bad Jamma'
);

BlogPosts.create(
    'This is a second test title',
    'Here is some more content to display. \n It is still good content!',
    'Bad Jamma'
);

router.get('/', (req,res)   =>  {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) =>  {
    const fieldCheck = ['title', 'content', 'author'];
    for (let i=0; i<fieldCheck.length; i++)    {
        const field = fieldCheck[i];
        if (!(field in req.body))   {
            const message = console.error(`\'${field}\' is not in the request`);
            return res.status(400).send(message);
        }
    }
    const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(post);
});

router.delete('/:id', (req, res)    =>  {
    BlogPosts.delete(req.params.id);
    console.log(`removed post \'${req.params.id}\'`);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res)   =>  {
    const fieldCheck = ['title', 'content', 'author'];
    for (let i=0; i<fieldCheck.length; i++) {
        const field = fieldCheck[i];
        if (!(field in req.body))   {
            const message = console.error(`\'${field}\' is not in the request`);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id)  {
        const message = console.error(`Request path id: \'${req.params.id}\' and request body id: \'${req.body.id}\' must match`);
        return res.status(400).send(message);
    }
    console.log(`Updating item: ${req.params.id}`);

        const updatedPost = BlogPosts.update({
            id: req.params.id,
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        });
        res.status(204).end();
})


module.exports = router;
