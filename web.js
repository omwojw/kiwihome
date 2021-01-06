var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require("./models/index.js");
const common = require('./common/common');
var session = require('express-session');
var debug = require('debug')('board:server');
var http = require('http');
var app = express();


/**
 * Get port from environment and store in Express.
 */

/**
 * 프로파일 지정  테스트
 * 윈도우 : set NODE_ENV=local&&npm start로 실행
 * 리눅스 : export NODE_ENV=local&&npm start로 실행
 */
var dotenv = require('dotenv');
dotenv.config({           
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV = ".env."+process.env.NODE_ENV
  )
});
var port = normalizePort(process.env.PORT || '8001');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}







/**
 * 세션을 사용하겠다는 의미
 */
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

/**
 * 미들웨어 request가 오면 무조건 거친다
 */
app.use(function (req, res, next) { 
  
  /**
   * response meta 데이터 초기화
   */
  common.reset(); 

   /**
   * 관리자 로그인 후 세션에 값을 담았다면 request 요청시마다 response데이터에 세션값 넣기
   */
  if(req.session.ADMIN && req.session.ADMIN.admin_seq){
    res.locals.ADMIN = req.session.ADMIN;
  }else{
    res.locals.ADMIN = {}
  }
  next();
});

/**
 * 뷰 엔진 셋팅 HTML로 셋팅함
 */
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * API 라우터 설정
 */

app.use('/api/v1/area', require('./routes/area.route'));
app.use('/api/v1/booking', require('./routes/booking.route'));
app.use('/api/v1/bookmark', require('./routes/bookmark.route'));
app.use('/api/v1/card', require('./routes/card.route'));
app.use('/api/v1/maneger', require('./routes/maneger.route'));
app.use('/api/v1/maneger_bookmark', require('./routes/maneger_bookmark.route'));
app.use('/api/v1/member', require('./routes/member.route'));
app.use('/api/v1/payment', require('./routes/payment.route'));
app.use('/api/v1/play', require('./routes/play.route'));
app.use('/api/v1/stadium', require('./routes/stadium.route'));
app.use('/api/v1/faq', require('./routes/faq.route'));
app.use('/api/v1/notice', require('./routes/notice.route'));
app.use('/api/v1/contact', require('./routes/contact.route'));
app.use('/api/v1/comment', require('./routes/comment.route'));

/**
 * 관리자 라우터 설정
 */
app.use('/supervise/warning', require('./routes/admin/warning.route'));
app.use('/supervise/login', require('./routes/admin/login.route'));
app.use('/supervise/admin', require('./routes/admin/admin.route'));
app.use('/supervise/faq', require('./routes/admin/faq.route'));
app.use('/supervise/contact', require('./routes/admin/contact.route'));
app.use('/supervise/notice', require('./routes/admin/notice.route'));
app.use('/supervise/common', require('./routes/admin/common.route'));

app.use('/supervise/member', require('./routes/admin/member.route'));
app.use('/supervise/maneger', require('./routes/admin/maneger.route'));
app.use('/supervise/stadium', require('./routes/admin/stadium.route'));
app.use('/supervise/stadium_detail', require('./routes/admin/stadium_detail.route'));
app.use('/supervise/play', require('./routes/admin/play.route'));
app.use('/supervise/item', require('./routes/admin/item.route'));


app.use('/se2', require('./routes/admin/smartedit.route'));
app.use('/supervise', require('./routes/admin/index.route'));

app.get('/images/:sub_folder/:file_name', function(req,res){
  console.log('/images/'+req.params.sub_folder+'/'+req.params.file_name)
  fs.readFile('/images/'+req.params.sub_folder+'/'+req.params.file_name, function(err, data){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(data);
  })
})



/**
 * 404에러시 실행될 함수
 */
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * 에러시 실행될 함수
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * DB 연결 체크
 */
models.sequelize.sync().then( () => {
  console.log(" DB 연결 성공");
}).catch(err => {
  console.log("연결 실패");
  console.log(err);
});

module.exports = app;
