let main = document.querySelector("main");

const api = new Api("medmixal");


// Генерация карточек из файла 
/* cats.forEach(function (cat) {
  let card = `<div class="${cat.favourite ? "card like" : "card"}" style="background-image: url(${cat.img_link})">
    <span>${cat.name}</span>
    </div>`;
  main.innerHTML += card;
}); */


/* let cards = document.getElementsByClassName("card");
for (let i = 0, cnt = cards.length; i < cnt; i++) {
  const width = cards[i].offsetWidth;
  cards[i].style.height = width * 0.6 + "px";
} */


const updCards = function (data) {
  main.innerHTML = "";

  data.forEach(function (cat) {
    if (cat.id) {
      let card = `<div class="${cat.favourite ? "card like" : "card"}" style="background-image: url(${cat.img_link || "images/cat.jpg"})" id="${cat.id}">
      <span>${cat.name}</span>
      </div>`;
      main.innerHTML += card;
    }
  });

  let cards = document.getElementsByClassName("card");

  for (let i = 0, cnt = cards.length; i < cnt; i++) {
    const width = cards[i].offsetWidth;
    cards[i].style.height = width * 0.6 + "px";

    cards[i].addEventListener('click', (e) => {
      console.log(cards[i].id);
      const popupCard = document.querySelector('#popup-card');
      
      let kitty = catsData.filter((e) => {return e.id == cards[i].id})

      if (!popupCard.classList.contains("active")) {
        popupCard.classList.add("active");
        popupCard.parentElement.classList.add("active");
        
        
        popupCard.innerHTML = "";  

        let popupCardInfo = `<div class="popup-close btn">
          <i class="fa-solid fa-xmark"></i>
          </div>
          <h2>Данные котика</h2>
          <div class="info-card__content">
          <div class="content-img">
          <img src="${kitty[0].img_link}" alt="">
          </div>
          <div class="content-text"><p>Id: ${kitty[0].id}</p>
          <p>Возраст: ${kitty[0].age}</p>
          <p>Имя: ${kitty[0].name}</p>
          <p>Рейтинг: ${kitty[0].rate}</p>
          <p>Описание: ${kitty[0].description}</p>
          <p>Любимчик: ${kitty[0].favourite}</p> </div>
          </div>`;
  
        popupCard.innerHTML += popupCardInfo;        
      }
      
      const closePopupCard = popupCard.querySelector(".popup-close");

      closePopupCard.addEventListener('click', () => {
        popupCard.classList.remove("active");
        popupCard.parentElement.classList.remove("active");
      })
    });
  }
}


let catsData = localStorage.getItem("cats");
catsData = catsData ? JSON.parse(catsData) : [];

const getCats = function (api, store) {
  if (!store.length) {
    api
      .getCats()
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.message === "ok") {
          localStorage.setItem("cats", JSON.stringify(data.data));
          catsData = [...data.data];
          updCards(data.data);
        }
      })
  } else {
    updCards(store);
  }
}

getCats(api, catsData);


let addBtn = document.querySelector("#add");
let popupForm = document.querySelector("#popup-form");
let closePopupForm = popupForm.querySelector(".popup-close");

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!popupForm.classList.contains("active")) {
    popupForm.classList.add("active");
    popupForm.parentElement.classList.add("active");
  }
});

closePopupForm.addEventListener("click", () => {
  popupForm.classList.remove("active");
  popupForm.parentElement.classList.remove("active");
})


let form = document.forms[0];
form.img_link.addEventListener("change", (e) => {
  form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})
form.img_link.addEventListener("input", (e) => {
  form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})
form.addEventListener("submit", e => {
  e.preventDefault();
  let body = {};
  for (let i = 0; i < form.elements.length; i++) {
    let inp = form.elements[i];
    if (inp.type === "checkbox") {
      body[inp.name] = inp.checked;
    } else if (inp.name && inp.value) {
      if (inp.type === "number") {
        body[inp.name] = +inp.value;
      } else {
        body[inp.name] = inp.value;
      }
    }
  }

  console.log(body);

  api
    .addCat(body)
    .then(res => res.json())
    .then(data => {
        if (data.message === "ok") {
          form.reset();
          closePopupForm.click();
          api
            .getCat(body.id)
            .then(res => res.json())
            .then(cat => {
              if (cat.message === "ok") {
                catsData.push(cat.data);
                localStorage.setItem("cats", JSON.stringify(catsData));

            getCats(api, catsData);
          } else {
            console.log(cat);
          }
        })
    } else {
      console.log(data);
      api
        .getIds()
        .then(r => r.json())
        .then(d => console.log(d));
    }
  })
})


let loginBtn = document.querySelector("#login");
let popupLogin = document.querySelector("#popup-login");
let closePopupLogin = popupLogin.querySelector(".popup-close");

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!popupLogin.classList.contains("active")) {
    popupLogin.classList.add("active");
    popupLogin.parentElement.classList.add("active");
  }
});

closePopupLogin.addEventListener("click", () => {
  popupLogin.classList.remove("active");
  popupLogin.parentElement.classList.remove("active");
})



const submitBtn = document.querySelector('#loginBtn');

submitBtn.onclick = () => {
  const login = document.querySelector('[name = "login"]');
  document.cookie = `Login=${login.value}`;
}






