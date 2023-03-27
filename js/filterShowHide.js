
        //  Show and hide filter 

        const filterMenu = document.getElementById('filter_menu'),
        filterA = document.getElementById('filterA'),
        closeA = document.getElementById('closeA')
        
      
        if(filterA){
            filterA.addEventListener('click', () =>{
                let menuVisible = closeA.style.visibility;
                if(menuVisible == 'visible'){
                    filterMenu.classList.remove('show')
                    closeA.style.visibility="hidden"
                }else{
                    filterMenu.classList.add('show')
                    closeA.style.visibility="visible"
                }
          })
      }
      
      if(closeA){
        closeA.addEventListener('click', () =>{
            filterMenu.classList.remove('show')
            closeA.style.visibility="hidden" 
          })
      }
      
      