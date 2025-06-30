// this
let editingProductId = null;

function openModal(id, productId) {
  if (productId) {
    editingProductId = productId;
  }
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "flex";

    // Close modal when clicking the X and clicking annuler button
    const closeBtn = modal.querySelectorAll(".close, .cancel");
    for (let i = 0; i < closeBtn.length; i++) {
      closeBtn[i].onclick = function () {
        modal.style.display = "none";
      };
    }

    // Close when clicking outside the modal-content
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  if (id === "delet-produit-modal") {
    let request = new XMLHttpRequest();
    request.open("GET", `http://localhost:3000/products/${editingProductId}`);
    request.responseType = "json";
    request.send();
    request.onload = function () {
      const productname = document.querySelector(
        ".productnamedeletnotification"
      );
      let posts = request.response;
      productname.innerHTML = ` <h2>etres vous sure de vouloir supprimer le produit <span class="delet_produit"> ${posts.title}</span> </h2>`;
      console.log(typeof posts);
      let modal = document.querySelector(".modal");
      modal.style.display = "none";
    };
  }
}

// get data from api in the
function loaddata() {
  showLoading(true);

  let request = new XMLHttpRequest();
  request.open("GET", "http://localhost:3000/products");
  request.responseType = "json";
  request.send();
  request.onload = function () {
    showLoading(false);

    const tbody = document.querySelector("tbody");
    if (request.status >= 200 && request.status < 300) {
      tbody.innerHTML = "";
      let posts = request.response;
      let index = 0;
      for (let post of posts) {
        tbody.innerHTML += `
                <tr>
                <td>${index}</td>
                <td>${post.title}</td>
                <td>${post.stocks} unités</td>
                <td>${post.sells} unités</td>
                <td>
                <a href="#" onclick="openModal('editer-produit-modal','${post.id}')" ><i class="fa-solid fa-square-pen"></i></a>
                <a href="#" onclick="openModal('delet-produit-modal','${post.id}')"><i class="fa-solid fa-trash"></i></a>
                </td>
                </tr>
                `;
        index++;
      }
      showFeedback("Données de tableaux chargées avec succès !");
    } else {
      showFeedback("Erreur lors du chargement des données.", "error");
    }
  };
  request.onerror = function () {
    showLoading(false);
    showFeedback("Erreur réseau lors du chargement des données.", "error");
  };
}
// load the data so it can load in the table
loaddata();
// creat new product function
function creatnewproduct() {
  showLoading(true);
  const newproductnam = document.getElementById("newnaminput").value;
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3000/products");
  request.responseType = "json";
  request.setRequestHeader("Accept", "*/*");
  request.setRequestHeader("Content-Type", "application/json");
  let bodyparams = `{
        "title": "${newproductnam}"
    }`;
  request.send(bodyparams);
  request.onload = function () {
    showLoading(false);
    if (request.status >= 200 && request.status < 300) {
      let response = request.response;
      console.log(response);
      console.log("the status code is " + request.status);
      let modal = document.querySelector(".modal");
      modal.style.display = "none";
      loaddata();
    }
  };
}

// edit product by id

function editerproductbyid() {
  showLoading(true);

  const editnewproductname =
    document.getElementById("editerpreduitinput").value;
  let request = new XMLHttpRequest();
  request.open("PUT", `http://localhost:3000/products/${editingProductId}`);
  request.responseType = "json";
  request.setRequestHeader("Accept", "*/*");
  request.setRequestHeader("Content-Type", "application/json");
  let bodyparams = `{
        "title": "${editnewproductname}"
    }`;
  request.send(bodyparams);
  request.onload = function () {
    showLoading(false);
    if (request.status >= 200 && request.status < 300) {
      const modal = document.getElementById("editer-produit-modal");
      modal.style.display = "none";
      loaddata();
    } else {
      showFeedback("Erreur lors de la modification.", "error");
    }
    request.onerror = function () {
      showLoading(false);
      showFeedback("Erreur réseau lors de la modification.", "error");
    };
  };
}
// delet product by id
function deletproductbyid() {
  showLoading(true);

  let request = new XMLHttpRequest();
  request.open("DELETE", `http://localhost:3000/products/${editingProductId}`);
  request.responseType = "json";
  request.setRequestHeader("Accept", "*/*");
  request.send();
  request.onload = function () {
    showLoading(false);
    if (request.status >= 200 && request.status < 300) {
      const modal = document.getElementById("delet-produit-modal");
      modal.style.display = "none";
      showFeedback("Opération supprimée avec succès !");
      loaddata();
    } else {
      showFeedback("Erreur lors du supprimer des operation.", "error");
    }
  };
  request.onerror = function () {
    showLoading(false);
    showFeedback(
      "Erreur réseau lors de la suppression de l'opération.",
      "error"
    );
  };
}

// searsh
function prdsearsh(value) {
  let request = new XMLHttpRequest();
  request.open("GET", `http://localhost:3000/products?search=${value}`);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    const tbody = document.querySelector("tbody");
    if (request.status >= 200 && request.status < 300) {
      tbody.innerHTML = "";
      let posts = request.response;
      let index = 0;
      for (let post of posts) {
        tbody.innerHTML += `
                <tr>
                <td>${index}</td>
                <td>${post.title}</td>
                <td>${post.stocks} unités</td>
                <td>${post.sells} unités</td>
                <td>
                <a href="#" onclick="openModal('editer-produit-modal','${post.id}')" ><i class="fa-solid fa-square-pen"></i></a>
                <a href="#" onclick="openModal('delet-produit-modal','${post.id}')"><i class="fa-solid fa-trash"></i></a>
                </td>
                </tr>
                `;
        index++;
      }
    }
  };
}

// Show feedback message
function showFeedback(message, type = "success") {
  const feedback = document.getElementById("feedback-message");
  feedback.textContent = message;
  feedback.style.display = "block";
  feedback.style.background = type === "success" ? "#d4edda" : "#f8d7da";
  feedback.style.color = type === "success" ? "#155724" : "#721c24";
  feedback.style.border =
    type === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb";
  setTimeout(() => {
    feedback.style.display = "none";
  }, 3000);
}

function showLoading(show = true) {
  const loading = document.getElementById("loading-indicator");
  loading.style.display = show ? "block" : "none";
}
