var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();



exports.getAllBlogs = async function() {
  let allBlogs = {};

  try {
    let blogs = await db.collection('blogs').get();
    for (blog of blogs.docs) {
      allBlogs[blog.id] = blog.data();
    }
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
      let blog = allBlogs[blogname];
      blog.blogname = blogname;
      let oneBlog = db.collection('blogs').doc(blogname);
      oneBlog.set({
        title: blog.title,
        image: blog.image,
        date: blog.date,
        author: blog.author,
        previewContent: blog.previewContent,
        content: [
          blog.content[0],
          blog.content[1]
        ],
        winks: blog.winks
      });
    }//for loop
  }
  catch (err) {
    console.log(err)
  }
}


exports.updateBlog = async function(id, blogData) {
  try {
    let allBlogs = await exports.getAllBlogs();
    allBlogs[id] = blogData;
    for (let blogname in allBlogs) {
      let blog = allBlogs[blogname];
      blog.blogname = blogname;
      let oneBlog = db.collection('blogs').doc(blogname);
      oneBlog.set({
        title: blog.title,
        image: blog.image,
        date: blog.date,
        author: blog.author,
        previewContent: blog.previewContent,
        content: [
          blog.content[0],
          blog.content[1]
        ],
        winks: blog.winks
      });
    }//for loop
  }
  catch (err) {
    console.log(err)
  }
}

exports.deleteBlog = async function(id) {
  try {
    const res = db.collection('blogs').doc(id).delete();
  }
  catch (err) {
    console.log(err)
  }
}
