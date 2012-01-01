module.exports = function(app){
    //Import required models
    app.post('/song', function(req, res){
        res.render('settings', {
            layout: 'page-layout',
            scripts: [],
            styles: ['song'],
            title: app.title + ' - Songs',
            settings: {}
        });
    });
};