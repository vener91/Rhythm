module.exports = function(app){
    app.get('/dash', app.passport.isLoggedIn, function(req, res){
        var User = app.mg.model('user');
    	//Get profile pic
    	if(typeof(req.user.facebook_id) != 'undefined'){
    		req.user.pic = "https://graph.facebook.com/" + req.user.facebook_id + "/picture";
    	} else {
    		req.user.pic = "/res/img/system/user.png";
    	}

        req.user.exp_precent = req.user.level_up_exp/User.getExp(req.user.level);
        res.render('dash', {
	        layout: 'page-layout',
            title: app.title + '- Dashboard',
            scripts: [],
            styles: ['dash'],
            user: req.user
        });
	});
};