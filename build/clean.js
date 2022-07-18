
'use strict';

const del = require('del');

del.sync([ 'dist/' ]);
del.sync([ 'dist/*/' ]);
