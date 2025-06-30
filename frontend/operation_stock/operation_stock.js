window.onload = function () {
  loaddata();
  selectedchoisedata();
};

let editingProductId = null;
let products = [];
function openModal(id, productId) {
  if (productId) {
    editingProductId = productId;
  }
  const modal = document.getElementById(id);
  if (modal) {
    // show model by flex
    modal.style.display = "flex";

    // Close modal when clicking the X and clicking annuler button
    const closeBtn = modal.querySelectorAll(".close, .btn-cancel");
    for (let i = 0; i < closeBtn.length; i++) {
      closeBtn[i].onclick = function () {
        modal.style.display = "none";
      };
    }

    // Close when clicking outside the modal-content
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  if (id === "delet-operation-modal") {
    let request = new XMLHttpRequest();
    request.open(
      "GET",
      `http://localhost:3000/stock-operations/${editingProductId}`
    );
    request.responseType = "json";
    request.send();
    request.onload = function () {
      const productname = document.querySelector(".productdeletbyid");
      let posts = request.response;
      productname.innerHTML = `
          <p>Vous êtes entrain de supprimer l'opération de stock de <span style="color: red;"> ${
            posts.name
          }</span> le  <span style="color: red;">${
        posts.date.split("T")[0]
      } </span></p>
          <p>La suppression de cette opération va impacter la quantité du stock des produits qui y sont inclus.</p>
          <p>Etes vous sûre de vouloir supprimer cette opération?</p>       
                `;
    };
  }
}

// get data from api in the
function loaddata() {
  showLoading(true);

  let request = new XMLHttpRequest();
  request.open("GET", "http://localhost:3000/stock-operations");
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
                <td>${post.name}</td>
                <td>${post.date.split("T")[0]} </td>
                <td>${post.articles.length} unités</td>
                <td>
                <a href="#" onclick="openModal('show-detail-modal','${
                  post._id
                }');showdetailbyid('${
          post._id
        }')" ><i class="fa-regular fa-eye"></i></a>
                  <a href="#" onclick="openModal('delet-operation-modal','${
                    post._id
                  }');"><i class="fa-solid fa-trash"></i></a>
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
// load the data so it can load in the option so we can selet it
function selectedchoisedata() {
  showLoading(true);

  let request = new XMLHttpRequest();
  request.open("GET", "http://localhost:3000/products");
  request.responseType = "json";
  request.send();
  request.onload = function () {
    showLoading(false);
    if (request.status >= 200 && request.status < 300) {
      products = request.response;
      const productchoised = document.querySelector("#productchoise");
      productchoised.innerHTML = "";
      products.forEach((product) => {
        const option = document.createElement("option");
        option.value = product._id;
        option.textContent = product.title + " (Stock: " + product.stocks + ")";
        productchoised.appendChild(option);
      });
    } else {
      showFeedback(
        "Erreur lors d ajouter des données dans le cas de selection.",
        "error"
      );
    }
  };
  request.onerror = function () {
    showLoading(false);
    showFeedback(
      "Erreur réseau lors du chargement des produits dans le cas de selection.",
      "error"
    );
  };
}

// after we choise a productand and hes quantity this function and we click on plus + this function add the pruduct to the articles
const fournisseurproduct = [];
function newproductquantity() {
  const productchoised = document.querySelector("#productchoise");
  const quantity = parseInt(document.querySelector("#quantity").value);

  if (isNaN(quantity) || quantity <= 0) {
    alert("Veuillez entrer une quantité valide.");
    return;
  }
  const productdiv = document.createElement("div");
  productdiv.className = "product-item";
  fournisseurproduct.push({
    product: productchoised.value,
    quantity: quantity,
    element: productdiv,
  });
  const selectedOption = productchoised.options[productchoised.selectedIndex];
  productdiv.innerHTML = `
    <span >${selectedOption.text}</span>
    <span >${quantity}</span>
   <button onclick="selectedproductdel(this)">&times;</button>
  `;
  document.getElementById("productlistshow").appendChild(productdiv);
  document.getElementById("quantity").value = "";
  console.log(fournisseurproduct);
}

function selectedproductdel(button) {
  const productdiv = button.parentElement;
  const index = fournisseurproduct.findIndex((p) => p.element === productdiv);
  if (index !== -1) {
    fournisseurproduct.splice(index, 1);
  }
  productdiv.remove();
  console.log(fournisseurproduct);
}

// new operation creat
function newoperation() {
  showLoading(true);
  const nom_fornisseur = document.querySelector("#nom_fornisseur").value;
  const dat_livraison = document.querySelector("#dat_livraison").value;
  if (!nom_fornisseur.trim()) {
    alert("Le nom du fournisseur est requis.");
    return;
  }
  if (fournisseurproduct.length === 0) {
    alert("you need to add products");
    return;
  }
  // we limit the fournisseurproduct array to the produt and quantity so we can add it to the articals in the  api
  const articalesarray = fournisseurproduct.map(({ product, quantity }) => ({
    product,
    quantity,
  }));

  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3000/stock-operations");
  request.responseType = "json";
  request.setRequestHeader("Accept", "*/*");
  request.setRequestHeader("Content-Type", "application/json");
  let bodyparams = JSON.stringify({
    name: nom_fornisseur,
    date: dat_livraison,
    articles: articalesarray,
  });
  request.send(bodyparams);
  request.onload = function () {
    showLoading(false);
    if (request.status >= 200 && request.status < 300) {
      let modal = document.querySelector(".modal");
      modal.style.display = "none";
      loaddata();
      document.getElementById("productlistshow").innerHTML = "";
    } else {
      // Improved error handling: show  error
      let errorMsg = "Erreur lors de la création de l'opération.";
      if (request.response && request.response.error) {
        errorMsg = request.response.error;
      }
      showFeedback(errorMsg, "error");
    }
  };

  console.log(articalesarray);
  document.querySelector("#nom_fornisseur").innerHTML = "";
}

// operation searsh
function prdsearsh(value) {
  showLoading(true);

  let request = new XMLHttpRequest();
  request.open("GET", `http://localhost:3000/stock-operations?search=${value}`);
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
                <td>${post.name}</td>
                <td>${post.date.split("T")[0]} </td>
                <td>${post.articles.length} unités</td>
                <td>
                <a href="#" onclick="openModal('show-detail-modal','${
                  post._id
                }')" ><i class="fa-regular fa-eye"></i></a>
                <a href="#" onclick="openModal('delet-operation-modal','${
                  post._id
                }')"><i class="fa-solid fa-trash"></i></a>
                </td>
                </tr>
                `;
        index++;
      }
    }
  };
}

// show product details by id
function showdetailbyid(operationId) {
  showLoading(true);

  const nameInput = document.querySelector(
    "#show-detail-modal #nom_fornisseur"
  );
  const dateInput = document.querySelector("#show-detail-modal #dat_livraison");
  const productList = document.querySelector(
    "#show-detail-modal #productlistshow"
  );

  let request = new XMLHttpRequest();
  request.open("GET", `http://localhost:3000/stock-operations/${operationId}`);
  request.responseType = "json";
  request.send();

  request.onload = function () {
    showLoading(false);

    if (request.status >= 200 && request.status < 300) {
      const operation = request.response;
      // let the inputs readonly
      nameInput.readOnly = true;
      dateInput.readOnly = true;
      // Set name and date
      nameInput.value = operation.name;
      dateInput.value = operation.date.split("T")[0];

      // Clear old product list
      productList.innerHTML = "";

      // Loop through articles and add each to productList
      operation.articles.forEach((article) => {
        // product name from /products
        const productName = article.product.title;
        const div = document.createElement("div");
        div.className = "product-item";
        div.innerHTML = `
          <span>${productName}</span>
          <span>${article.quantity}</span>
        `;
        productList.appendChild(div);
      });
      showFeedback("Détails de l'opération chargés !");
    } else {
      showFeedback("Erreur lors du chargement des détails.", "error");
    }
  };
  request.onerror = function () {
    showLoading(false);
    showFeedback("Erreur réseau lors du chargement des détails.", "error");
  };
}

// delet stock
function deletoperationbyid() {
  showLoading(true);

  let request = new XMLHttpRequest();
  request.open(
    "DELETE",
    `http://localhost:3000/stock-operations/${editingProductId}`
  );
  request.responseType = "json";
  request.setRequestHeader("Accept", "*/*");
  request.send();
  request.onload = function () {
    showLoading(false);
    if (request.status >= 200 && request.status < 300) {
      const modal = document.getElementById("delet-operation-modal");
      modal.style.display = "none";
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
