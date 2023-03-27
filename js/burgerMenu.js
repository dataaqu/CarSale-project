
        //  Show and hide mobile version burger menu

const navMenu = document.getElementById('nav_menu'),
  burgerMenu = document.getElementById('burger_menu'),
  navClose = document.getElementById('nav_close'),
  btn = document.getElementById('btn_neon')

  if(burgerMenu){
    burgerMenu.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
        
    })
}

if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu') 
    })
}

