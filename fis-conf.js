/**
 * Created by huang on 11/07/2017.
 */
/**
 * Created by huangpengyun on 16/11/29.
 */

/****************************************************************************************
 * 开启资源的相对地址
 * 安装  npm install fis3-hook-relative
 */

fis.match('*',{
    release:'v4/$0'
});
/****************************************************************************************
 * 1.压缩js
 */
fis.match('js/*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js')
});

/************************************d****************************************************
 * 2.压缩css
 */
fis.match('assets/style.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css')
});


/****************************************************************************************
 * 4.对合并CSS进行图片合并
 */
fis.config.set('modules.spriter', 'csssprites');
fis.config.set('settings.spriter.csssprites', {
    //图之间的边距
    margin: 10,
    //使用矩阵排列方式，默认为线性`linear`
    layout: 'matrix'
});
fis.match('::package', { // 启用 fis-spriter-csssprites 插件
    spriter: fis.plugin('csssprites')
});

fis.match('*.css', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});

fis.match('::packager', {
    postpackager: fis.plugin('loader')
});

/****************************************************************************************
 * 5.合并资源加时间戳
 */

fis.set('date', new Date);

fis.match('*.{js,css,png,jpg,html}', {
    query: '?t=' + (fis.get('date').getYear() + 1900) +
    (fis.get('date').getMonth() + 1) +
    (fis.get('date').getDate()) +
    (fis.get('date').getHours()) +
    (fis.get('date').getMinutes()) +
    (fis.get('date').getSeconds()) +
    (fis.get('date').getMilliseconds())
});
/****************************************************************************************
 * 6.忽略打包无用文件
 */
fis.set('project.ignore', [
    'source/**',
    'node_modules/**',
    'pack-release/**',
    '.git/**',
    '.svn/**',
    'README.md',
    '*.json',
    '*.js',
    'npm-debug.log',
    '.gitignore'
]);
