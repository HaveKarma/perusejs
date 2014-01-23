'use strict';
/*
Karma - PeruseJS
*/

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),

        jshint:
        {
            src: ['*.js'],
            options:
            {
                'jshintrc': true,
                'ignores': 'test/*'
            }
        
        },

        mochaTest: {
            peruse: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'test/**/*.js'
                ]
            }
        }

    });

    grunt.registerTask('default', ['jshint', 'mochaTest']);
    
};