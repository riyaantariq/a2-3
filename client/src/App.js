import React from 'react';

function App() {
  return (
    <div>
      <header>
        <h1>Blogging Platform</h1>
      </header>
      <main>
        {/* Your React Components will go here */}
      </main>
      <footer>
        <p>&copy; 2023 Blogging Platform</p>
      </footer>
    </div>
  );
}


document.addEventListener('DOMContentLoaded', function () {
  const blogListElement = document.getElementById('blogList');

  fetch('http://localhost:475/api/posts')
      .then(response => response.json())
      .then(data => {
          // Render the list of blogs
          renderBlogList(data.posts);
      })
      .catch(error => console.error('Error fetching blogs:', error));

  function renderBlogList(blogs) {
      // Clear existing blog list
      blogListElement.innerHTML = '';

      // Render each blog as a list item
      blogs.forEach(blog => {
          const blogItem = document.createElement('li');
          blogItem.className = 'blog-item';

          const titleElement = document.createElement('h2');
          titleElement.textContent = blog.title;

          const authorElement = document.createElement('p');
          authorElement.textContent = `Author: ${blog.author.username}`;

          const contentElement = document.createElement('p');
          contentElement.textContent = blog.content;

          blogItem.appendChild(titleElement);
          blogItem.appendChild(authorElement);
          blogItem.appendChild(contentElement);

          blogListElement.appendChild(blogItem);
      });
  }
});


export default App;
