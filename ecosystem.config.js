module.exports = {
  apps: [
    {
      name: 'feature-scoping-game',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/feature-scoping-game',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/feature-scoping-game-error.log',
      out_file: '/var/log/pm2/feature-scoping-game-out.log',
      log_file: '/var/log/pm2/feature-scoping-game-combined.log',
      time: true
    },
    {
      name: 'socket-server',
      script: 'scripts/socket-server.js',
      cwd: '/var/www/feature-scoping-game',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/socket-server-error.log',
      out_file: '/var/log/pm2/socket-server-out.log',
      log_file: '/var/log/pm2/socket-server-combined.log',
      time: true
    }
  ]
}; 