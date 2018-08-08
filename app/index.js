'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Greeting
    this.log(
      yosay(`Welcome to the madness ${chalk.blue('generator-madfront')} generator!`)
    );

    const prompts = [
      {
        type: 'prompt',
        name: 'appname',
        message: 'Your project name ?',
        default: 'Madfront'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.appname = props.appname;
    });
  }

  writing() {
    this._writingGulpFile();
    this._writingPackageJSON();
    this._writingBowerJSON();
    this._writingHtml();
    this._writingStyles();
    this._writingScripts();
    this._writingMisc();
    this._writingExtras();
  }

  _writingPackageJSON() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {appname: this.appname}
    );
  }

  _writingBowerJSON() {
    this.fs.copyTpl(
      this.templatePath('bower.json'),
      this.destinationPath('bower.json'),
      {appname: this.appname}
    );
  }

  _writingGulpFile() {
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );
  }

  _writingHtml() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {appname: this.appname}
    );
  }

  _writingStyles() {
    this.fs.copyTpl(
      this.templatePath('style.scss'),
      this.destinationPath('src/scss/style.scss')
    );
  }

  _writingScripts() {
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/js/main.js')
    );
  }

  _writingExtras() {
    this.fs.copyTpl(
      this.templatePath('robots.txt'),
      this.destinationPath('src/robots.txt')
    );

    this.fs.copyTpl(
      this.templatePath('favicon.ico'),
      this.destinationPath('src/favicon.ico')
    );

    this.fs.copyTpl(
      this.templatePath('apple-touch-icon.png'),
      this.destinationPath('src/apple-touch-icon.png')
    );
  }

  _writingMisc() {
    mkdirp('src/images');
    mkdirp('src/fonts');
  }

  install() {
    this.installDependencies({
      bower: true,
      npm: true
    });
  }
};
