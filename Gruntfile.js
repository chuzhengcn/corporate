module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'public/js/custom.js']
        }
    });

    // 加载包含 "jshint" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['jshint']);

};