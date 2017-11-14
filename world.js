window.onload=function(){
    let search=document.getElementById("lookup");
    
    search.onclick=function(){
        
        let ajax = new XMLHttpRequest();
        let country=document.getElementById("country");
        var url='world.php?country='+country.value;
        ajax.onreadystatechange = function()
   {
       if(ajax.readyState==4 && ajax.status==200){
       document.getElementById("result").innerHTML = this.responseText;
       
        }
        
   }
   
   
        ajax.open("GET",url, true);
        ajax.send();
}
}
