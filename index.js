/**
 * Created by alone on 17-5-10.
 */
'use strict';
const config = require('./config.json');
const App = require('./server/WebServer');
App.listen(config.port, '0.0.0.0');

// 初始化连接zk
