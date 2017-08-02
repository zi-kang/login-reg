/**
 * Created by huang on 05/07/2017.
 */
const path = require('path');
const fs = require('fs');

module.exports = function (grunt) {
    require('jit-grunt')(grunt);
    require("load-grunt-tasks")(grunt);
    var replacement = [
        {
            from: '<!-- header -->',
            to: function () {
                var filePath = __dirname + '/source/static/header.html';
                return fs.readFileSync(filePath, 'UTF-8');
            }
        },
        {
            from: '<!-- footer -->',
            to: function () {
                var filePath = __dirname + '/source/static/footer.html';
                return fs.readFileSync(filePath, 'UTF-8');
            }
        }
    ];

    grunt.initConfig({
        copy: {
            img: {
                files: [
                    {
                        expand: true,
                        cwd: 'source',
                        src: 'img/**',
                        dest: 'dist/'
                    }
                ]
            },
            font: {
                files: [
                    {
                        expand: true,
                        cwd: 'source',
                        src: 'font/**',
                        dest: 'dist/'
                    }
                ]
            },
            js: {
                files: [
                    {
                        'dist/js/vue.js': 'source/js/vue.js',
                        'dist/js/vue-slider.js': 'source/js/vue-slider.js',
                    }
                ]
            }
        },
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/js/login.js': 'source/js/login.js',
                    'dist/js/register.js': 'source/js/register.js',
                    'dist/js/drag.js': 'source/js/drag.js',
                    'dist/js/findpwd.js': 'source/js/findpwd.js',
                }
            }
        },
        less: {
            development: {
                options: {
                    compress: false,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "dist/assets/style.css": "source/style/style.less"
                }
            }
        },
        connect: {
            dev: {
                options: {
                    hostname: 'localhost', // Most important!
                    protocol: "http",
                    port: '9595',
                    base: 'dist/',
                    keepalive: true,
                    livereload: true,
                    open: true
                }
            }
        },
        watch: {

            options: {
                livereload: true
            },
            styles: {
                files: ['source/style/*.less'], // which files to watch
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            },
            pages: {
                files: ['source/*.html', 'source/static/*.html'], // which files to watch
                tasks: ['replace'],
                options: {
                    nospawn: true
                }
            },
            img: {
                files: ['source/img/*.{png,jpg,gif.ico}'], // which files to watch
                tasks: ['copy:img'],
                options: {
                    nospawn: true
                }
            },
            js: {
                files: ['source/js/*.js'], // which files to watch
                tasks: ['babel'],
                options: {
                    nospawn: true
                }
            }
        },
        replace: {
            root: {
                src: ['source/*.html'],
                dest: 'dist/',
                replacements: replacement
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-babel');
    grunt.registerTask('default', ['replace', 'babel', 'copy', 'less', 'watch']);
    grunt.registerTask('server', ['connect']);
    grunt.registerTask('copyImg', ['copy:img']);
    grunt.registerTask('copyJs', ['copy:js']);
};