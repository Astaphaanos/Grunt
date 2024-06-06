 /*
 module.exports = function (grunt) {
    grunt.initConfig({ //configuração do grunt
        pkg: grunt.file.readJSON('package.json'),
        less: { //configurar o less
            development: { //development: para o ambiente local
                files: { 
                    'main.css': 'main.less'
                }
            },
            production: { //ambiente de produção final (vercel, hosting...)
                options: {
                    compress: true, //comprimir o less
                },
                files: { 
                    'main.min.css': 'main.less'
                }
            }
        },
        sass: { //configurar o sass
            dist: {
                options: {
                    style: 'compressed' //comprimir o sass
                },
                files: {
                    'main2.css': 'main.scss'
                }
            }
        },
        concurrent: { //configuração do plugin para executar tarefas paralelas
            target: ['less', 'sass'] //passa o nome das tarefas no array
        },
        watch: { //configurar o watch
            less: {
                files ['src/styles/**.less'], //tem mais um asterisco e barra
                tasks: ['less:development'] 
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-less') //compilador de less
    grunt.loadNpmTasks('grunt-contrib-sass') //compilador de sass
    grunt.loadNpmTasks('grunt-contrib-watch') //chamar o watch
    grunt.loadNpmTasks('grunt-concurrent') // plugin para executar tarefas de forma paralela

    grunt.registerTask('default', ['concurrent']); //criação do default e declarar a tafera para executar
}

Compilar com LESS -> npm install --save-dev grunt-contrib-less 
Compilar com SASS -> npm install --save-dev grunt-contrib-sass
Executar as tarefas de forma paralela -> npm install --save-dev grunt-concurrent 
Watch -> npm install --save-dev grunt-contrib-watch
*/

module.exports = function (grunt) {
    grunt.initConfig({ 
        pkg: grunt.file.readJSON('package.json'),
        less: { 
            development: { 
                files: { 
                    'dev/styles/main.css': 'src/styles/main.less'
                }
            },
            production: { 
                options: {
                    compress: true, 
                },
                files: { 
                    'dist/styles/main.min.css': 'src/styles/main.less'
                }
            }
        },
        watch: { 
            less: {
                files: ['src/styles/**/*.less'],
                tasks: ['less:development']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
        },
        replace: { //configuração do replace
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: '../src/scripts/main.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: [ 'src/index.html'],
                        dest: 'dev/'
                    }
                ]
            },
            dist: { //dist
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.min.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: './scripts/main.min.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: [ 'prebuild/index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        htmlmin: { //configuração do htmlmin
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                },
                files: {
                    'prebuild/index.html': 'src/index.html'
                }
            }
        },
        clean: ['prebuild'], //apagar arquivos temporários
        uglify: { // configurações do compressor de JavaScript
            target: {
                files: {
                    'dist/scripts/main.min.js': 'src/scripts/main.js'
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-less') 
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-replace')
    grunt.loadNpmTasks('grunt-contrib-htmlmin')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-uglify')

    grunt.registerTask('default', ['watch']); 
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']);
    
}