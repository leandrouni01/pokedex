(()=>{
    document.getElementById("login").style.display = "block";
})()

function login(e){
    e.preventDefault();
    const user = document.querySelector("#user").value;
    const password = document.querySelector("#password").value;

    fetch('http://localhost:3000/login',
    {
        method: 'POST',
        body: JSON.stringify({ user: user, password: password }),
        headers: {
          'Content-Type': 'application/json'}
    }).then(res=>{
        
    }).catch(err=>{

    })
}

function register(e){
    e.preventDefault();
    const user = document.querySelector("#user2").value;
    const password = document.querySelector("#password2").value;
    const repeatPassword = document.querySelector("#repeatPassword2").value;
    if(password == repeatPassword){
        fetch('http://localhost:3000/register',{
            method: 'POST',
            body: JSON.stringify({ user: user, password: password }),
            headers: {
                'Content-Type': 'application/json'}
        }).then(res=>{

        }).catch(err=>{

        })
    }else{
        alert("Las contraseñas no coinciden");
    }
}


function changeTab(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }