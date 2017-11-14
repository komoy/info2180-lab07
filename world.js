window.onload=function(){
    let search=document.getElementById("lookup");
    
    search.onclick=function(){
        
        let ajax = new XMLHttpRequest();
        let country=document.getElementById("country");
        let url = 'world.php?';
        if ($("#all")[0].checked){
            url+='all=true';
        }else{
            url+='country='+country.value;
        }
        ajax.onreadystatechange = function()
   {
       if(ajax.readyState==4 && ajax.status==200){
       document.getElementById("result").innerHTML = this.responseText;
       
        }
        
   }
   
   
        ajax.open("GET",url, true);
        ajax.send();
}
    let checkbox="<input id=all type= checkbox name=country>all</input> ";
    $("#lookup").after(checkbox);
    document.getElementById("all").onclick=function()
    {
            
        
    }
}
