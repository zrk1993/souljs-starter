module.exports = {
  "apps": [
    {
      "name": "soul-starter",
      "script": "./dist/main.js",
      "cwd": "./",
      // "watch": [
      //   "bin",
      //   "config",
      //   "routes",
      //   "views"
      // ],
      "error_file": "./log/pm2-website-err.log",
      "out_file": "./log/pm2-website-out.log",
      "log_date_format": "YYYY-MM-DD HH:mm Z"
    }
  ]
};