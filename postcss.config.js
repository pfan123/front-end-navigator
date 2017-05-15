module.exports = {
  plugins: [
  	  require('postcss-import')(),
      require('autoprefixer')({browsers: ["> 5%", "last 2 versions", "ie >= 8"] })
  ]
}