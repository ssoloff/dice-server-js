/* jshint bitwise: true,
          curly: true,
          eqeqeq: true,
          esversion: 6,
          forin: true,
          freeze: true,
          latedef: nofunc,
          noarg: true,
          nocomma: true,
          node: true,
          nonbsp: true,
          nonew: true,
          plusplus: true,
          singleGroups: true,
          strict: true,
          undef: true,
          unused: true
*/

'use strict';

const del = require('del');
const gulp = require('gulp');

const BUILD_OUTPUT_DIR = 'build';

gulp.task('clean', () => {
  return del([BUILD_OUTPUT_DIR]);
});
