module.exports = function(app){
    app.get('/dash', app.passport.isLoggedIn, function(req, res){

    	//Get profile pic
    	if(typeof(user.facebook_id) != 'undefined'){
    		req.user.pic = "https://graph.facebook.com/" + user.facebook_id + "/picture";
    	} else {
    		req.user.pic = "/res/img/system/user.png";
    	}
        res.render('dash', {
	        layout: 'page-layout',
            title: app.title + '- Dashboard',
            scripts: [],
            styles: ['dash'],
            user: req.user
        });
	});
};