# MCU
Akash Kumar's Interest Site for Advanced Topics in Computer Science

To generate this website, make sure that you have fs, ejs, and less installed. To do so, type the following into your terminal.
  1) npm install fs --save
  2) npm install ejs --save
  3) npm install less --save

Now, to actually generate the webpages, execute the following in the terminal:
  1) ./node_modules/less/bin/lessc ./LESS/styles.less ./build/css/styles.css
  2) node blog_generator.js

(1) compiles the LESS into CSS, and (2) generates the html files through the EJS templates and data/content.json.
