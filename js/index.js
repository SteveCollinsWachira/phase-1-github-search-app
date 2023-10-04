const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const reposList = document.getElementById('repos-list');


async function searchUsers(query) {
    const response = await fetch(`https://api.github.com/search/users?q=${query}`);
    const data = await response.json();
    return data.items;
}


async function getUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    return response.json();
}


searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== '') {
        const users = await searchUsers(searchTerm);

        
        searchResults.innerHTML = '';

        if (users.length === 0) {
            searchResults.innerHTML = 'No users found';
        } else {
            users.forEach(user => {
                const userCard = document.createElement('div');
                userCard.classList.add('user-card');
                userCard.innerHTML = `
                    <img src="${user.avatar_url}" alt="${user.login}" />
                    <h2>${user.login}</h2>
                    <a href="${user.html_url}" target="_blank">Profile</a>
                `;
                userCard.addEventListener('click', async () => {
                    const repos = await getUserRepos(user.login);
                    displayUserRepos(repos);
                });
                searchResults.appendChild(userCard);
            });
        }
    }
});


function displayUserRepos(repos) {
    reposList.innerHTML = '';
    if (repos.length === 0) {
        reposList.innerHTML = 'No repositories found for this user.';
    } else {
        const repoList = document.createElement('ul');
        repos.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'No description'}</p>
            `;
            repoList.appendChild(repoItem);
        });
        reposList.appendChild(repoList);
    }
}
