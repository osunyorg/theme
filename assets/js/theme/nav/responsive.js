const events = ['load', 'resize'];
let header = document.querySelector('header[role="banner"]'),
    navBtn = document.querySelector('nav[role="navigation"] button'),
    menuHeader = document.querySelector('.menu'),
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
            });
            
            dropdownBtns.forEach((dropdownBtn) => {
                dropdownBtn.addEventListener("click", function(){
                    this.href = "javascript:void(0)"
            
                    if(this.getAttribute('aria-expanded') == "true") {
                        this.setAttribute('aria-expanded', 'false')
                    } 
                    else {
                        this.setAttribute('aria-expanded', 'true')
                    }
                })
            })
        }
    })
});




