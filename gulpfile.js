var	gulp =	require('gulp'),
		connect	=	require('gulp-connect'),
    jscs = require('gulp-jscs'),
    uglify = require('gulp-uglify'),
		inject = require('gulp-inject'),
		gulpif = require('gulp-if'),
		useref = require('gulp-useref'),
    templateCache	=	require('gulp-angular-templatecache'),
    wiredep	=	require('wiredep').stream;


//	Servidor web de	desarrollo
gulp.task('server',	function() {
	connect.server({
		root:	'./app',
		hostname:	'0.0.0.0',
		port:	8080,
		livereload:	true
	});
});

//	Servidor web de	produccion
gulp.task('server-dist',	function()	{
	connect.server({
		root:	'./dist',
		hostname:	'0.0.0.0',
		port:	8082,
		livereload:	true
	});
});

//	Recarga	el navegador cuando	hay	cambios	en el	HTML
gulp.task('livereload',	function() {
	gulp.src('./app/**/*.html')
		.pipe(connect.reload());
});

//	Busca	errores	en el	JS y nos los muestra por pantalla
gulp.task('jshint',	function() {
	return gulp.src('./app/scripts/**/*.js')
  .pipe(jscs({configPath: '.jscsrc'}))
  .pipe(jscs.reporter());
});

//	Busca en las carpetas de estilos y javascript	los	archivos que hayamos creado
//	para inyectarlos en	el index.html
gulp.task('inject', function() {
	var sources = gulp.src(['./app/stylesheets/**/*.css', './app/scripts/**/*.js'], {read:false});
	return gulp.src('./app/index.html')
	.pipe(inject(sources, {relative: true}))
	.pipe(gulp.dest('./app'));
});

//	Inyecta	las	librerias	que	instalemos vía Bower
gulp.task('wiredep', function () {
	gulp.src('./app/index.html')
		.pipe(wiredep({
			directory:	'./app/lib'
		}))
		.pipe(gulp.dest('./app'));
});

//Esta tarea archivos enlazados en el index.html los depositará en el nuevo directorio
//para producción que será /dist, ya minificados.
//En este directorio también necesitamos el index.html pero sin los comentarios y con
//los enlaces a los nuevos ficheros minificados.
gulp.task('compress',	function()	{
		gulp.src('./app/index.html')
				.pipe(useref())
				.pipe(gulpif('*.js', uglify({ mangle: false })))
				.pipe(gulp.dest('./dist'));
});

//Copia los enlaces a los nuevos ficheros minificados.
gulp.task('copy',	function()	{
		gulp.src('./app/index.html')
				.pipe(useref())
				.pipe(gulp.dest('./dist'));
});

//	Compila	las	plantillas	HTML	parciales	a	JavaScript
//	para	ser	inyectadas	por	AngularJS	y	minificar	el	código
gulp.task('templates',	function()	{
		gulp.src('./app/views/**/*.tpl.html')
				.pipe(templateCache({
						root:	'views/',
						module:	'frontEndApp.templates',
						standalone:	true
				}))
				.pipe(gulp.dest('./app/scripts'));
});

//	Vigila cambios que se produzcan	en el	código y lanza las tareas relacionadas
gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['livereload', 'templates']);
  gulp.watch(['./app/scripts/**/*.js', './gulpfile.js'], ['jshint',	'inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
  gulp.watch(['./app/**/*.html'], ['livereload']);
});


gulp.task('default', ['server', 'templates', 'inject', 'wiredep', 'watch']);
gulp.task('build', ['templates', 'compress', 'copy']);
