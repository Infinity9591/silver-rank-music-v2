module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.'
  }, {
    script: 'deploy_commands.js',
    watch: '.'
  }],

  deploy : {
    production : {
      ref  : 'origin/master',
      repo : 'https://github.com/Infinity9591/SilverRankMusicv2.git',
    }
  }
};
