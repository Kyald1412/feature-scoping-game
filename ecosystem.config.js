module.exports = {
  apps: [
    {
      name: 'feature-scoping-game',
      script: 'npm',
      args: 'start',
      cwd: './',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/feature-scoping-game-error.log',
      out_file: './logs/feature-scoping-game-out.log',
      log_file: './logs/feature-scoping-game-combined.log',
      time: true
    },
    {
      name: 'socket-server',
      script: './scripts/socket-server.js',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/socket-server-error.log',
      out_file: './logs/socket-server-out.log',
      log_file: './logs/socket-server-combined.log',
      time: true
    }
  ]
}; 