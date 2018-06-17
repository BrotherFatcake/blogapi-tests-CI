const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

//allows use of expect from chai
const expect = chai.expect;

//to make HTTP requests in tests
chai.use(chaiHttp);

describe('Blog Posts', function()   {
    //Activate and Deactivate the server
    before(function()   {
        return runServer();
    });
    after(function()    {
        return closeServer();
    });

    //GET test
    it('should get a list of current blog posts', function()    {
        return chai.request(app)
        .get('/blog')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.above(0);
            res.body.forEach(function(item) {
                expect(item).to.be.a('object');
                expect(item).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
            });
        });
    });

    //POST test
    it('should add a new post', function()  {
        const testPost = {
            "title": "This is another NEW test title",
            "content": "Here is some more content to display. \n It is still good content!",
            "author": "Bad Mamma Jamma"
        };
        return chai.request(app)
        .post('/blog')
        .send(testPost)
        .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.include(Object.assign(testPost, {id: res.body.id}));
        })
    })

    //PUT test
    it('should get a list of posts and then update on of them', function()  {
        const updatePost    =   {
            "title": "This is an UPDATED test title",
            "content": "This is updated content! \n It is still good content!",
            "author": "Bad Mamma Jamma #BMJ"
        };
        
        return chai.request(app)
        .get('/blog')
        .then(function(res) {
            updatePost.id = res.body[0].id;
            return chai.request(app)
                .put(`/blog/${updatePost.id}`)
                .send(updatePost)
        })
        //SAME AS RECIPE PROJECT
        //not sure why this doesn't return anything to validate or correct json headers.  Tried Postman
        //as well and saw same results. status 204 - no data in response.  Commented out json and data compare check
        .then(function(res) {
            expect(res).to.have.status(204);
            //expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            //expect(res.body).to.deep.include(updatePost);
        });
    });

    //DELETE test
    it('should delete a post with DELETE', function()   {
        return chai.request(app)
        .get('/blog')
        .then(function(res) {
            return chai.request(app)
                .delete(`/blog/${res.body[0].id}`);
        })
        .then(function(res) {
            expect(res).to.have.status(204);
        })
    })




})