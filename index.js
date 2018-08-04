$(document).ready(()=>{
   
let dynurl;
});

//Click on search button
$(".submit").click(function(){
  //remove cards of previous search request
  $(".card").remove();
  //remove alerts of previous search requests
  $(".alert").remove();
  //check which form is submitted
  if(this.id=="form1"){
    let imdbId=$("#imdbId").val();
    //check id value and show message accordingly
    if (imdbId=="" || imdbId==undefined)
    {
          let alert=`<div class="alert alert-danger alert-dismissible fade show " role="alert" >
                 <div class="alert-data text-center"> </div>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>`
      $("#alert-container").append(alert)
      $(".alert-data").html("You forgot to type IMDB Id!")
    }
    else 
    {
      dynurl=`http://www.omdbapi.com/?i=${imdbId}&apikey=ec176b5b` //set url according control values and call function
      getdata(dynurl)
    } 
  }
  else{
    let imdbtitle=$("#title").val();
    let imdbyear=$("#year").val();
    //check id value and show message accordingly
    if (imdbtitle=="" || imdbtitle==undefined)
    {
      let alert=`<div class="alert alert-danger alert-dismissible fade show " role="alert" >
                <div class="alert-data text-center"> </div>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>`
      $("#alert-container").append(alert)
      $(".alert-data").html("You forgot to type Title!")
    }
    else 
    {//set url according control values and call function
      if (imdbyear=="" || imdbyear==undefined){
        dynurl=`http://www.omdbapi.com/?s=${imdbtitle}&apikey=ec176b5b`     
      }
      else{
        dynurl=`http://www.omdbapi.com/?t=${imdbtitle}&y=${imdbyear}&apikey=ec176b5b`
      }
      getdata(dynurl)
    }
  }
});

function getdata(dynurl)
{
  console.log("making request")

    $.ajax({
        type: 'GET', // request type GET, POST, PUT
        dataType: 'json', // requesting datatype
        url: dynurl, // URL of getting data       
        success: (data) => { // in case of success response
          console.log(data)
           let tempRow1;
           if (data.Response.toLowerCase()=="true"){ //check  value of response whether its true or false
              if (data.hasOwnProperty("Search")){    //check if there are multiple results or not by checking search object
                for(allPeople of data.Search){
                   tempRow1=`<div class="card" >`
                   CreateCard(allPeople,tempRow1)
                               
                 }
              }
            
              else{ //if result is not array  populate the card element
                let allPeople=data
                tempRow1=`<div class="card single-card" >`
                    CreateCard(allPeople,tempRow1)
            } 
          }
        
          else{ //in case response is false create an alert to show error
            let alert=`<div class="alert alert-danger alert-dismissible fade show " role="alert" >
                      <div class="error-data text-center"> </div>
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                      </button>
                      </div>`
            $("#error-container").append(alert)   
            let e=`Oops ${data.Error} Please try again later!` 
            $(".error-data").html(e)
          }   
        },
        error: (data) => { // in case of error response create an alert 
          let alert=`<div class="alert alert-danger alert-dismissible fade show " role="alert" >
                    <div class="error-data text-center"> </div>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    </div>`
          let e=`Oops ${data.Error} Please try again later!` 
          $("#error-container").append(alert)
          $(".error-data").html(e)
        },
        beforeSend: () => { // while request is processing.
            //  loader here.
          $("#loader-div").addClass("loader");
        },
        complete: () => {
            // remove loader when request is completed
            $("#loader-div").removeClass("loader");
        },
        timeout:3000 // this is in milli seconds
    }); // end of AJAX request
}

function CreateCard (allPeople,tempRow1){
  
   let poster=allPeople.Poster
                if (poster=="N/A"){
                  poster="mov.png"
                }
                tempRow1 +=` <div class="d-flex justify-content-center"><img class="card-img-top poster-img" src="${poster}" alt="Card image cap"></div>
                              <div class="card-body">
                              <h5 class="card-title text-center">${allPeople.Title}</h5>`
                let tempRow2="";
                for(key in allPeople){
                  if(key!="Poster" && key!="Title")
                  {
                    tempRow2 +=`<p class="card-text"><b>${key} :</b>`
                    if (Array.isArray(allPeople[key])==false){
                      tempRow2+=`  ${allPeople[key]}</p>`
                    }
                    else{
                      for(a in allPeople[key]){
                        if (Array.isArray(a)==true){
                          tempRow2+=` ${a}</p>`
                        } 
                        else{            
                          for(h in allPeople[key][a]){
                            tempRow2+=`  ${allPeople[key][a][h]}`
                          }
                          tempRow2+=`</p>`
                        }
                      }
                    }
                  }
                }
              let temp3=`</div>
                        </div>`
              let temp4=tempRow1+tempRow2+temp3
              $("#card-container").append(temp4); 
}