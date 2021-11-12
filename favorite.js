const URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
const favoriteUsers = JSON.parse(localStorage.getItem('favorite'));
const user_Per_Page = 20
const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector('#paginator')
let filteredUsers = []
const searchBar = document.querySelector('.search-bar')
const input = document.querySelector('input')
const form = document.querySelector('.form')

renderUserList(getUserPages(1))
renderPaginator(favoriteUsers.length)

// EventListener
// more information or remove from favorite
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".card-img-top")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});
// search
form.addEventListener("click", function onPanelClicked(event) {
  event.preventDefault()
  const target = event.target
  const string = input.value.trim().toLowerCase()
  if (target.matches('.fa-search')) {
    searchUser(string)
  }
})
form.addEventListener("keydown", function enterPressed(event) {
  const string = input.value.trim().toLowerCase()
  if (event.key === 'Enter') {
    event.preventDefault()
    searchUser(string)
  }
})

// pagination
paginator.addEventListener('click', function onPaginatorClicked(event) {
  const target = event.target
  if (target.matches('.page-link')) {
    renderUserList(getUserPages(target.dataset.page))
  }
})
// function 
function renderUserList(data) {
  let rawHTML = "";
  // if (!data.length) {
  //   dataPanel.innerHTML = rawHTML;
  //   return
  // }
  data.forEach((user) => {
    rawHTML += `<div class="card col-md-2 m-2 p-1">
      <img src="${user.avatar}" class="card-img-top img-fluid" alt="photo" data-toggle="modal"
                data-target="#user-modal" data-id="${user.id}"
      <div class="card-body">
        <h5 class="card-title d-flex justify-content-between align-items-center m-0">${user.name}<span class="mt-2"><button class="btn btn-danger btn-remove-favorite btn-sm" data-id="${user.id}">X</button></span></h5>
        <h6 class="card-info">Region : ${user.region}</h6>
      </div>
    </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

function showUserModal(id) {
  const modalTitle = document.querySelector(".modal-title");
  const modalText = document.querySelector("#modal-text");
  axios.get(URL + id).then((response) => {
    const data = response.data;
    modalTitle.innerHTML = `<p>${data.name}  ${data.surname}</p>`;
    modalText.innerHTML = `<p>email:${data.email}<br>
        gender:${data.gender}<br>
        age:${data.age}<br>
        birthday:${data.birthday}
        </p>`;
  });
}

function removeFromFavorite(id) {
  const targetIndex = favoriteUsers.findIndex((person) => person.id === id)
  if (targetIndex === -1) return
  favoriteUsers.splice(targetIndex, 1)
  localStorage.setItem('favorite', JSON.stringify(favoriteUsers))
  renderUserList(getUserPages(1))
  renderPaginator(favoriteUsers.length)
}

function searchUser(string) {
  filteredUsers = favoriteUsers.filter((user => {
    const name = user.name + '' + user.surname
    return name.toLowerCase().includes(string)
  }))
  if (Number(filteredUsers) === 0) {
    alert('您輸入的關鍵字查無結果')
    return
  }
  renderUserList(getUserPages(1))
  renderPaginator(filteredUsers.length)
  input.value = ''
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / user_Per_Page)
  let rawHTML = '';
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item" ><a class="page-link" href="#" data-page=${page}>${page}</a></li >`
  }
  paginator.innerHTML = rawHTML
}

function getUserPages(page) {
  const data = filteredUsers.length ? filteredUsers : favoriteUsers
  startIndex = (page - 1) * user_Per_Page
  return data.slice(startIndex, startIndex + user_Per_Page)
}


