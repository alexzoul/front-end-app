var	gulp =	require('gulp'),
		connect	=	require('gulp-connect'),
    jscs = require('gulp-jscs'),
    uglify = require('gulp-uglify'),
		inject = require('gulp-inject'),
		gulpif = require('gulp-if'),
		useref = require('gulp-useref'),
    templateCache	=	require('gulp-angular-templatecache'),
		sass = require('gulp-sass'),
		sassLint = require('gulp-sass-lint'),
		minifyCss	=	require('gulp-minify-css'),
    wiredep	=	require('wiredep').stream;


gulp.task('server',	function() {
	connect.server({
		root:	'./app',
		hostname:	'0.0.0.0',
		port:	8080,
		livereload:	true
	});
});

gulp.task('livereload',	function() {
	gulp.src('./app/**/*.html')
		.pipe(connect.reload());
});

gulp.task('scsslint', function() {
	return gulp.src('./app/stylesheets/**/*.s+(a|c)ss')
		.pipe(sassLint({
			config: '.sass-lint.yml',
			files: {
				ignore: './app/stylesheets/reset.scss'
			},
		}))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('styles', function() {
  return gulp.src('./app/stylesheets/main.scss')
    .pipe(sass({
      outputStyle: "compressed"
    }).on('error', sass.logError))
    .pipe(gulp.dest('./app/stylesheets'))
		.pipe(connect.reload());
});

gulp.task('jshint',	function() {
	return gulp.src('./app/scripts/**/*.js')
  	.pipe(jscs({configPath: '.jscsrc'}))
  	.pipe(jscs.reporter());
});

gulp.task('inject', function() {
	var sources = gulp.src(['./app/stylesheets/**/*.css', './app/scripts/**/*.js'], {read:false});
	return gulp.src('./app/index.html')
		.pipe(inject(sources, {relative: true}))
		.pipe(gulp.dest('./app'));
});

gulp.task('inject-bower-components', function () {
	gulp.src('./app/index.html')
		.pipe(wiredep({
			directory:	'./app/lib'
		}))
		.pipe(gulp.dest('./app'));
});

gulp.task('templates',	function()	{
	gulp.src('./app/views/**/*.tpl.html')
		.pipe(templateCache({
			root:	'views/',
			module:	'frontEndApp.templates',
			standalone:	true
		}))
		.pipe(gulp.dest('./app/scripts'));
});

gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['livereload', 'templates']);
	gulp.watch(['./app/stylesheets/**/*.scss'],	['scsslint', 'styles']);
  gulp.watch(['./app/scripts/**/*.js', './gulpfile.js'], ['jshint']);
});

gulp.task('default', ['templates', 'styles', 'inject-bower-components', 'inject', 'server', 'watch']);


gulp.task('compress',	function()	{
	gulp.src('./app/index.html')
		.pipe(useref())
		.pipe(gulpif('*.css',	minifyCss()))
		.pipe(gulpif('*.js', uglify({ mangle: false })))
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy',	function()	{
	gulp.src('./app/index.html')
		.pipe(useref())
		.pipe(gulp.dest('./dist'));
});

gulp.task('dist-server',	function()	{
	connect.server({
		root:	'./dist',
		hostname:	'0.0.0.0',
		port:	8088,
	});
});

gulp.task('build', ['templates', 'compress', 'copy', 'dist-server']);
