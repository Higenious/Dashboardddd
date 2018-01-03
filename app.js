var express            =  require('express');
var path               =  require('path');
var cookieParser       =  require('cookie-parser');
var bodyParser         =  require('body-parser');
var exphbs             =   require('express-handlebars');
var flash              =   require('connect-flash');
var mongo              =   require('mongodb');
var expressValidator   =  require('express-validator');
var session            = require('express-session');
var passport           = require('passport');
var LocalStrategy      = require('passport-local').Strategy;
var mongoose           =  require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db                 = mongoose.connection;


var routes             =  require('./routes/index');
var users              =  require('./routes/users');


//Init App
var app   = express();


//Views Engines

app.set('views' , path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars' , exphbs( {defaultLayout: 'layout'}));
app.set('view engine' , 'handlebars');


//Body parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended :false}));
app.use(cookieParser());


// Set Static Folder


//express session

app.use(session({
    secret : 'secret',
    saveUninitialized : true,
    resave  : true
}));

//passport init

app.use(passport.initialize());
app.use(passport.session());




// Express validator

app.use(expressValidator({
    errorFormatter :function (param, msg, value) {
        var namespace   = param.split('.'),
            root        =  namespace.shift(),
            formParam  =   root;



        while(namespace.length){
            formParam  += '['+namespace.shift()+   ']';
        }
        return {
            param  : formParam,
            msg    : msg,
            value  : value
        };
    }
}));


// Connect Flash

app.use(flash());

//Global Vars

app.use(function (req, res, next) {
    res.locals.success_msg  =  req.flash('succes_msg');
    res.locals.error_msg    =  req.flash('error_msg');
    res.locals.error        =  req.flash('error');
    next();
});


//Routes
app.use('/', routes);
app.use('/users', users);


//Set Port

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
    console.log('Server Started on Port ' +app.get('port'));

});