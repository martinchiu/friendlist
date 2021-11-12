const URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
const users = [];
let filteredUsers = []
const list = JSON.parse(localStorage.getItem('favorite')) || []
const user_Per_Page = 20
const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector('#paginator')
const navbar = document.querySelector('.navbar')
const searchBar = document.querySelector('.search-bar')
const input = document.querySelector('input')
const form = document.querySelector('.form')
// use axios get data and render browser 
axios.get(URL).then((response) => {
  users.push(...response.data.results);
  renderUserList(getUserPages(1));
  renderPaginator(users.length)
  checkFavorite(list)
});

// EventListener
// more information 、 add to favorite or remove from favorite
dataPanel.addEventListener("click", function onPanelClicked(event) {
  const target = event.target
  if (target.matches(".card-img-top")) {
    showUserModal(target.dataset.id);
  } else if (target.matches(".btn-light")) {
    addToFavorite(Number(target.dataset.id))
    target.classList.remove('btn-light')
    target.classList.add('btn-dark')
  } else if (target.matches(".btn-dark")) {
    removeFromFavorite(Number(target.dataset.id))
    target.classList.remove('btn-dark')
    target.classList.add('btn-light')
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
// form.addEventListener("keydown", function enterPressed(event) {
//   const string = input.value.trim().toLowerCase()
//   if (event.key === 'Enter') {
//     event.preventDefault()
//     searchUser(string)
//   }
// })
form.addEventListener("submit", function enterPressed(event) {
  const string = input.value.trim().toLowerCase()
  event.preventDefault()
  searchUser(string)
})
// pagination
paginator.addEventListener('click', function onPaginatorClicked(event) {
  const target = event.target
  if (target.matches('.page-link')) {
    renderUserList(getUserPages(target.dataset.page))
  }
})
// function
// render browser
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((user) => {
    rawHTML += `<div class="card col-md-2 m-2 p-1">
      <img src="${user.avatar}" class="card-img-top img-fluid" alt="photo" data-toggle="modal"
                data-target="#user-modal" data-id="${user.id}"
      <div class="card-body">
        <h5 class="card-title d-flex justify-content-between align-items-center m-0">${user.name}
          <span class="mt-2">
            <button class="btn btn-light btn-sm btn-add-favorite" data-id="${user.id}">+</button>
          </span></h5>
        <h6 class="card-info">Region : ${user.region}</h6>
      </div>
    </div>`;
    dataPanel.innerHTML = rawHTML;
  });
}
// modal
function showUserModal(id) {
  const modalTitle = document.querySelector(".modal-title");
  const modalText = document.querySelector("#modal-text");
  axios.get(URL + id).then((response) => {
    const data = response.data;
    modalTitle.innerHTML = `<p>${data.name}  ${data.surname}</p>`;
    modalText.innerHTML = `
        <div class="row d-flex justify-content-around">     
           <div class="m-2"><img src="${data.avatar}" alt="avatar" class="img-fluid"></div>
           <div class="m-2">
            <p>email:${data.email}</p>
            <p>gender:${data.gender}</p>
            <p>age:${data.age}</p>
            <p>birthday:${data.birthday}</p>
           </div>
         </div>`
  });
}
// search
function searchUser(string) {
  filteredUsers = users.filter((user => {
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
  checkFavorite(list)
}
function addToFavorite(id) {
  const user = users.find((users) => users.id === id)
  list.push(user)
  localStorage.setItem('favorite', JSON.stringify(list))
}

function removeFromFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favorite'))
  const targetIndex = list.findIndex((user) => user.id === id)
  list.splice(targetIndex, 1)
  localStorage.setItem('favorite', JSON.stringify(list))
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
  const data = filteredUsers.length ? filteredUsers : users
  startIndex = (page - 1) * user_Per_Page
  return data.slice(startIndex, startIndex + user_Per_Page)
}

function checkFavorite(data) {
  if (!data.length) return
  const allPlusIcon = document.querySelectorAll('.btn-add-favorite')
  data.forEach((item) => {
    allPlusIcon.forEach((icon) => {
      if (Number(icon.dataset.id) === item.id) {
        icon.classList.remove('btn-light')
        icon.classList.add('btn-dark')
      }
    })
  })
}