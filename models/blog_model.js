var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();

//var fs = require('fs');


exports.getAllBlogs = async function() {
  let allBlogs = {};

  try {
    let blogs = await db.collection('blogs').get();

    for (blog of blogs.docs) {
      allBlogs[blog.title] = blog.data();
    };

    return allBlogs;
  } catch (err) {
    console.log('Error getting documents', err);
  }
}



exports.getBlog = async function(id) {
  try {
    let allBlogs = await exports.getAllBlogs();

    if (allBlogs[id]) {
      console.log(id);
      return allBlogs[id];
    }
  } catch (err) {
    console.log(err)
  }
}


exports.saveBlog = async function(id, newBlog) {
  try  {
    let allBlogs = await exports.getAllBlogs();
    allBlogs[id] = newBlog;
    for (let blogname in allBlogs) {
      let blog = blogs[blogname];
      blog.blogname = blogname;
      let oneBlog = db.collection('blogs').doc(blogname);
      oneBlog.set({
        title: blog.title,
        image: blog.image,
        author: blog.author,
        previewContent: blog.previewContent,
        content: [
          blog.content[0],
          blog.content[1]
        ],
        // tags: [
        //   [blog.tags[0][0], blog.tags[0][1]],
        //   [blog.tags[1][0], blog.tags[1][1]],
        //   [blog.tags[2][0], blog.tags[2][1]]
        // ],
        winks: blog.winks
      });
    }//for loop
  }
  catch (err) {
    console.log(err)
  }
}

exports.updateBlog = function(id, blogData) {
  exports.saveBlog(id, blogData)
}

exports.deleteBlog = function(id) {
  var blogData = exports.getAllBlogs();
  delete blogData[id];
  fs.writeFileSync('data/blogs.json', JSON.stringify(blogData));
}
