const Express = require('express');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const Passport = require("passport");
const cors = require('cors');
const path = require('path');
const portNo = `5000`, host = `localhost`;
const App = Express();

const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
 
App.use(cors(corsOptions)); 
App.use(BodyParser.json({limit: '50mb'})); // set request size
App.use(BodyParser.urlencoded({limit: '50mb', extended: true })); //create application/x-www-form-urlencoded parser
App.use(CookieParser());
App.use(Passport.initialize());
App.use(Passport.session());


const db = require('./app/config/db/db.config');

// force: true will drop the table if it already exists
db.sequelizeDB.sync({force: false}).then(() => {
  console.log('Drop and Resync with { force: false }');
});


App.use('/', require('./app/routes/users'));
App.use('/userData', require('./app/routes/dataRoute'));
require('./app/token-inspector/passport');

//App.use('/banner_img', Express.static('/banners'));
//App.use('/public', Express.static('./app/public'));
// Public assets
//App.use(`/images`, Express.static(path.join(__dirname, './app/public/banners')));

App.use('/images', require('./app/config/imagePath/imagePath'));
// Set port
App.set(`port`, (process.env.PORT || portNo));
App.set(`host`, (process.env.HOST || host));



App.listen(App.get(`port`), () => {
    console.log(`Server started at ${App.get(`host`)}:${App.get(`port`)}`)
  //logger.info(`Server started at ${App.get(`host`)}:${App.get(`port`)}`);
});