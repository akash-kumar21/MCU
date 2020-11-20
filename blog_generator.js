const fs = require('fs');
const ejs = require('ejs');

let posts = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));
let blog_template = fs.readFileSync('views/blog.ejs', 'utf8');

//blogs
for (let i = 0; i < posts.length; i++) {
  let blog_html = ejs.render(blog_template, {//loop through each blog post
    filename: __dirname + '/views/blog.ejs',
    data: posts[i],
    allPosts: posts
  });
  let name = "build/" + (posts[i]['title'].replace(/ /g, "-")) + '.html'//.replaceAll(' ', '_');
  fs.writeFileSync(name, blog_html, 'utf8');
}//loop through each blog post


//index
let index_template = fs.readFileSync('views/index.ejs', 'utf8');
let index_html = ejs.render(index_template, {
  filename: __dirname + '/views/index.ejs',
  allPosts: posts
});
fs.writeFileSync('build/index.html', index_html, 'utf8');


//about
let about_template = fs.readFileSync('views/about.ejs', 'utf8');
let about_html = ejs.render(about_template, {
  filename: __dirname + '/views/about.ejs',
  allPosts: posts
});
fs.writeFileSync('build/about.html', about_html, 'utf8');
