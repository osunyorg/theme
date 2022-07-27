const events = ['load', 'resize'];
let navBtn = document.querySelector('nav[role="navigation"] button'),
    menuHeader = document.querySelector('.menu'),
    bodyOverlay = document.querySelector('body'),
    dropdownBtns = document.querySelectorAll('.has-children a[role="button"]'),
    breckpointMd = 768,
    classMobile = 'show';
        
events.forEach((event) => {
    window.addEventListener(event, () => {
        windowWidth = window.innerWidth;

        if (windowWidth <= breckpointMd) {
            navBtn.addEventListener("click", function(){
                if(menuHeader.className.includes(classMobile)) {
                    navBtn.setAttribute('aria-expanded', 'false')
                } 
                else {
                    navBtn.setAttribute('aria-expanded', 'true')
                }
                menuHeader.classList.toggle(classMobile)
                bodyOverlay.classList.toggle('has-overlay')
            });
            
            dropdownBtns.forEach((dropdownBtn) => {
                dropdownBtn.addEventListener("click", (e) => {
                    e.preventDefault() 
            
                    if(dropdownBtn.getAttribute('aria-expanded') == "true") {
                        dropdownBtn.setAttribute('aria-expanded', 'false')
                    }
                    else {
                        dropdownBtn.setAttribute('aria-expanded', 'true')
                    }
                })
            })
        }
    })
});




