
// global 
let cars = [];
let total = 0;
let brand = null;
let search = null;
let pages = 0;
let size = 3;
let currentPage = 1;


// adds listeners on logo imgs and then initcars
function initBrands() {
    const filters = [...document.getElementsByClassName('logos-img')];
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            brand = filter.id;
            
            resetGlobalValues();
            initCars();
            
        })
    });
}


// sets search listener on enter button 
function initSearch(){
    const searchInp =  document.getElementById('search');
    searchInp.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            search = searchInp.value;
            resetGlobalValues();
            initCars();
        }
    })
}


// take data from db and if filter is active sets cars total and make car render
function initCars() {
    fetch('../../db.json')
        .then(res => res.json())
        .then(data => {
            if (data.car) {
                cars = data.car;
                if (brand) {
                    cars = cars.filter(car => car.brand == brand);
                }
                if (search) {
                    cars = cars.filter(car => car.title.toLowerCase().includes(search.toLowerCase()));
                }
                total = cars.length;
                const from = (currentPage - 1) * size;
                const to = from + size;
                cars = cars.slice(from, to);
                renderCars();
            }
        })
}


// render cars with pagination and adds buy buttons listeners 
function renderCars() {
    const carList = document.getElementById('carPark-list-id');
    let carsHTML = '';
    
    cars.forEach((car) => {
        carsHTML += `
        <div class="car-card">
           <div class="car-img">
               <img src=${car.img}  alt="">
           </div>     
           <div class="car-det">
               <p class="title">${car.title} </p>
               <p class="description">${car.description}</p>
               <div class="card-footer">
               
                   <p class="brands">${car.brand}</p>
                   
               </div>
               
            </div>  
            <p class="price">${car.price}$</p>
            <div><button class="buy" id="${car.id}"> Buy</button></div> 
            
       </div>
        `
    });
    carList.innerHTML = carsHTML;
    addCartListeners();
    pagination();
}


// adds listeners buy button
function addCartListeners(){
    const rentBtns = [...document.getElementsByClassName('buy')];
    
    rentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
            const car_id = btn.id;
          
            const localStorageCar = (cars.filter(car => car.id == car_id))[0];
          
            if(!((cart.filter(car => car.id == car_id)).length > 0)){
               
                cart.push(localStorageCar);
                localStorage.setItem('cart', JSON.stringify(cart));
                setCartCounter();
                populateCartDiv();
            }
        });
    });
}

 // sets cart counter, and then render cars and adds button close/open listener
 function initCart(){
    setCartCounter();
    initCartButtonListener();
    populateCartDiv();
}


// buy cars takes from local storage and sets in html cart
function setCartCounter(){
    const cartCounterContainer = document.getElementById('cart-number');
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    cartCounterContainer.innerHTML = cart.length;
}


// add on cart button listeners

function initCartButtonListener(){
    const cartBtn = document.getElementById('addToCartBtn');
    cartBtn.addEventListener('click', () => {
        const cartDiv = document.getElementById('cart');
    
        let cartDivClasses = cartDiv.className.split(' ');
        
        if(cartDivClasses.includes('showCart')){
            cartDiv.classList.remove("showCart");
        }else{
            cartDiv.classList.add("showCart");
        }
    });
}


// take data from cart and  init each product in html list aslo count price sum, if user is authorized show checkout button
function populateCartDiv(){
    let user = localStorage.getItem('logedInUser');
    let total = 0;
    const cartDiv = document.getElementById('cart');
  
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    let cartItemsHtml = "<h3 class='cartTitle'>Your Purchase </h3> <ul>";
    cart.forEach((car) => {
        total += parseInt(car.price);
        cartItemsHtml += `
            <li class="cartItem" id=${car.id}>
            <button class="removeFromCartBtn" id="${car.id}"><i class="ri-close-fill"></i></button>
                <img class="cartItemImg" src="${car.img}">
                
                <div class="cartDet"> 
                <div class="cartTitle">${car.title}</div>
                <div class="cartPrice">${car.price}$</div>
                </div>
             
            </li>
        `;
    });
    
    if(total){
        cartItemsHtml += "<br><div class='total'>Total: " + total + "$</div>";
        if(user){
            cartItemsHtml += "<br><li><button class='checkout'>Checkout</button></li>";
        }
    }
    
    cartItemsHtml += "</ul>";
    cartDiv.innerHTML = cartItemsHtml;
    cartItemRemoveListeners();
}


// add delete button listener
function cartItemRemoveListeners(){
    const removeBtns = [...document.getElementsByClassName('removeFromCartBtn')];
    
    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('cart'));
            const car_id = btn.id;
         
            cart = cart.filter(car => car.id != car_id);
            localStorage.setItem('cart', JSON.stringify(cart));
                  
            setCartCounter();
           
            populateCartDiv();
        });
    });
}


//render pagination and adds pagination buttons listeners 
function pagination() {
    pages = Math.ceil(total / size);
    let paginationDiv = document.getElementById("carsPagination");
    let paginationHtml = '';
    paginationHtml += '<button class="numbers">Prev</button>';

    for (let i = 1; i <= pages; i++) {
        paginationHtml += '<button class="numbers">' + i + '</button>';
    }

    paginationHtml += '<button class="numbers">Next</button>';
    paginationDiv.innerHTML = paginationHtml;
    pagein();
};


// adds listeners on pagination buttons (next/prev)
function pagein() {
    const pageBtn = [...document.getElementsByClassName('numbers')];
    pageBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.textContent == 'Prev') {
                if (currentPage - 1 < 1) {
                    return
                }
                currentPage = currentPage - 1;
                initCars();
            } else if (btn.textContent == 'Next') {
                if (currentPage + 1 > pages) {
                    return
                }
                currentPage = currentPage + 1;
                initCars();
            } else {
                if (currentPage == parseInt(btn.textContent)) {
                    return
                }
                currentPage = parseInt(btn.textContent);
                initCars();
            }
        })
    });
};


// after search and filter reset data
function resetGlobalValues() {
    cars = [];
    total = 0;
    pages = 0;
    currentPage = 1;
}


window.onload = function () {
    initCart();
    initBrands();
    initCars();
    initSearch();
    auth();
}
