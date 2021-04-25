let blogTitle = document.getElementsByTagName("h1")[1].innerText.replace(" ", "-").trim();
console.log("blog title:" + blogTitle);



document.getElementById("wink_button").addEventListener('click', function(){
  let xmlhttp = new XMLHttpRequest();

  // Specify details of the POST request
  xmlhttp.open("POST", "/blog/wink/"+blogTitle, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");



  // Define the data you’d like to send to the server
  let postData = {
   "wink": 1
  };

  // Make a POST request with your data in the body of the request
  xmlhttp.send(JSON.stringify(postData)); //postData gets sent to server.js as request.body



  // Do something once the Response (Good or Bad) has been received
  xmlhttp.onreadystatechange = function(data) {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let userObject=JSON.parse(xmlhttp.responseText);
          document.getElementById("wink_count").innerText=userObject.winks;
      }
      else {

  	  }
  }
});//end of winking



document.getElementById("comment_button").addEventListener('click', function() {
  let xmlhttp = new XMLHttpRequest();

  // Specify details of the POST request
  xmlhttp.open("POST", "/blog/comments/"+blogTitle, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  let author = document.getElementById('author').value;
  let content = document.getElementById('content').value;

  let isCommentValid = true;
  if (content === "") {
    alert("Comment content may not be an empty string");
    isCommentValid = false;
  }

  let divElement = document.createElement("div");
  divElement.appendChild(document.createElement("hr")); //add horizontal line

  let authorPara = document.createElement('p');
  let authorText = document.createTextNode("Author: " + author);
  authorPara.appendChild(authorText);
  divElement.appendChild(authorPara);

  let datePara = document.createElement('p');
  let d = new Date();
  let month = d.getMonth() + 1;
  if (month == 1) {month = "January"};
  if (month == 2) {month = "February"};
  if (month == 3) {month = "March"};
  if (month == 4) {month = "April"};
  if (month == 5) {month = "May"};
  if (month == 6) {month = "June"};
  if (month == 7) {month = "July"};
  if (month == 8) {month = "August"};
  if (month == 9) {month = "September"};
  if (month == 10) {month = "October"};
  if (month == 11) {month = "November"};
  if (month == 12) {month = "December"};
  let dateNum = d.getDate();
  let year = d.getFullYear();
  let date = month + " " + dateNum + ", " + year;

  let dateText = document.createTextNode("Date: " + date);
  datePara.appendChild(dateText);
  divElement.appendChild(datePara);

  let contextPara = document.createElement("p");
  let contextText = document.createTextNode(content);
  contextPara.appendChild(contextText);
  divElement.appendChild(contextPara);

  let like_buttons = document.getElementsByClassName("like_button");

  let likePara = document.createElement("p");
  likePara.innerHTML = "Likes: ";
  let likeSpan = document.createElement("span");
  likeSpan.id = "like_count_" + like_buttons.length;
  likeSpan.innerHTML = 0 + " ";
  likeSpan.className += "like_count";
  likePara.appendChild(likeSpan);

  let button = document.createElement("button");
  button.innerHTML = "Like";
  button.className += "btn btn-success btn-sm";
  likePara.appendChild(button);
  divElement.appendChild(likePara);

  button.addEventListener('click', function(){
    let xmlhttp = new XMLHttpRequest();

    // Specify details of the POST request
    xmlhttp.open("POST", "/blog/likes/"+blogTitle, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // Define the data you’d like to send to the server
    let postData = {
     "likes": 1,
     "index": like_buttons.length-1
    };

    // Make a POST request with your data in the body of the request
    xmlhttp.send(JSON.stringify(postData)); //postData gets sent to server.js as request.body

    // Do something once the Response (Good or Bad) has been received
    xmlhttp.onreadystatechange = function(data) {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let userObject = JSON.parse(xmlhttp.responseText);
            document.getElementById("like_count_" + like_buttons.length).innerText = userObject.comments[like_buttons.length-1].likes + " ";
        }
        else {

        }
    }
  });//button event listener

  divElement.appendChild(document.createElement("br")); //add newline

  if (isCommentValid) {
    document.getElementById('comment-block').appendChild(divElement);
  }



  // Define the data you’d like to send to the server
  let postData = {
    "author": author,
    "date": date,
    "content": content,
    "isCommentValid": isCommentValid
  };

  // Make a POST request with your data in the body of the request
  xmlhttp.send(JSON.stringify(postData)); //postData gets sent to server.js as request.body

  // Do something once the Response (Good or Bad) has been received
  xmlhttp.onreadystatechange = function(data) {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let userObject = JSON.parse(xmlhttp.responseText);
          document.getElementById("wink_count").innerText = userObject.winks;
      }
      else {

  	  }
  }
});//end of commenting


  let like_buttons = document.getElementsByClassName("like_button");
  for (let i = 0; i < like_buttons.length; i++) {
    let button = like_buttons[i];
    button.addEventListener('click', function(){
      let xmlhttp = new XMLHttpRequest();

      // Specify details of the POST request
      xmlhttp.open("POST", "/blog/likes/"+blogTitle, true);
      xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      // Define the data you’d like to send to the server
      let postData = {
       "likes": 1,
       "index": i
      };

      // Make a POST request with your data in the body of the request
      xmlhttp.send(JSON.stringify(postData)); //postData gets sent to server.js as request.body

      // Do something once the Response (Good or Bad) has been received
      xmlhttp.onreadystatechange = function(data) {
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
              let userObject = JSON.parse(xmlhttp.responseText);
              document.getElementById("like_count_" + i).innerText = userObject.comments[i].likes;
          }
          else {

          }
      }
    });//end of button event listener
  }//end of button loop
/*

*/
