const {src, dest, series, watch} = require ('gulp');
const sync = require ('browser-sync').create();
const dist = './dist/';
const del = require ('del');
const htmlmin = require ('gulp-htmlmin');
const htmlhint = require ('gulp-htmlhint');
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const esmify = require('esmify');
const imagemin = require('gulp-imagemin');

function html() {
    return src('src/**.html')
        .pipe(htmlhint())
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
     .pipe(dest(dist))
}

function lessTo() {
    return src('src/css/**.less')
        .pipe(less({plugins: [autoprefix]}))
        .pipe(dest(dist+'/css'))
}

function scripts(){
    return browserify({
        entries: [
            './src/scripts/index.js'
        ],
        plugin: [ esmify ]
    })
        .bundle()
        .pipe(source('main.js'))
        .pipe(dest(dist+'/scripts'));

}

function data(){
    return src('src/data/**.json')
        .pipe(dest(dist+'/data'));
}

function imgs(){
    return src('src/imgs/**.**')
        .pipe(imagemin())
        .pipe(dest(dist+'/imgs'));
}

function icon(){
    return src('src/**.ico')
        .pipe(dest(dist));
}

function clear(){
    return del(dist, {force:true});
}

function serve (){
    sync.init({
        server: {baseDir: './dist/'}
    });
    watch('src/**.html', series(html)).on('change', sync.reload);
    watch('src/css/**.less', series(lessTo)).on('change', sync.reload);
    watch('src/scripts/**/*.js', series(scripts)).on('change', sync.reload);
    watch('src/Data/**.json', series(data)).on('change', sync.reload);
    watch('src/imgs/**.**', series(imgs)).on('change', sync.reload);
    watch('src/**.ico', series(icon)).on('change', sync.reload);
}


exports.build = series(clear, html, lessTo, scripts, data, imgs, icon);
exports.serve = series(clear, lessTo, scripts, data, imgs, icon, html, serve);
exports.default = series(clear, lessTo, scripts, data, imgs, icon, html, serve);