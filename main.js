const form = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const reposDiv = document.getElementById('repos');
const toggleBtn = document.getElementById('toggle-search');

let searchType = 'user'; // or 'repo'

toggleBtn.addEventListener('click', () => {
  searchType = searchType === 'user' ? 'repo' : 'user';
  toggleBtn.textContent = searchType === 'user' ? 'Search Repos' : 'Search Users';
  resultsDiv.innerHTML = '';
  reposDiv.innerHTML = '';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  resultsDiv.innerHTML = '';
  reposDiv.innerHTML = '';
  if (!query) return;
  if (searchType === 'user') {
    searchUsers(query);
  } else {
    searchRepos(query);
  }
});

function searchUsers(query) {
  fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`, {
    headers: { Accept: 'application/vnd.github.v3+json' }
  })
    .then(res => res.json())
    .then(data => {
      if (!data.items) {
        resultsDiv.textContent = 'No users found.';
        return;
      }
      resultsDiv.innerHTML = '';
      data.items.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-result';
        userDiv.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" width="50" />
          <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        userDiv.addEventListener('click', (e) => {
          e.preventDefault();
          showUserRepos(user.login);
        });
        resultsDiv.appendChild(userDiv);
      });
    });
}

function showUserRepos(username) {
  reposDiv.innerHTML = 'Loading repos...';
  fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos`, {
    headers: { Accept: 'application/vnd.github.v3+json' }
  })
    .then(res => res.json())
    .then(repos => {
      reposDiv.innerHTML = `<h3>Repositories for ${username}:</h3>`;
      if (!Array.isArray(repos) || repos.length === 0) {
        reposDiv.innerHTML += '<p>No repositories found.</p>';
        return;
      }
      const ul = document.createElement('ul');
      repos.forEach(repo => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        ul.appendChild(li);
      });
      reposDiv.appendChild(ul);
    });
}

function searchRepos(query) {
  fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`, {
    headers: { Accept: 'application/vnd.github.v3+json' }
  })
    .then(res => res.json())
    .then(data => {
      if (!data.items) {
        resultsDiv.textContent = 'No repositories found.';
        return;
      }
      resultsDiv.innerHTML = '<h3>Repository Results:</h3>';
      const ul = document.createElement('ul');
      data.items.forEach(repo => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.full_name}</a>`;
        ul.appendChild(li);
      });
      resultsDiv.appendChild(ul);
    });
}