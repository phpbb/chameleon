const express = require('express');
const compression = require('compression');

const app = express();
app.use(compression());

app.use(express.static('./tests/views'));
app.use('/all', express.static('./all'));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + app.get('port'));
});
