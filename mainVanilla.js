let getData = async (url) => {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  };


let darkBtn = document.querySelector("#dark-button");
let theme = document.querySelector("#theme-selector");

darkBtn.addEventListener("click", () => {
  if(theme.getAttribute("href") === "style-light.css"){
    theme.setAttribute("href", "style-dark.css");
    darkBtn.innerHTML = "Light mode";
  }
  else{
    theme.setAttribute("href", "style-light.css");
    darkBtn.innerHTML = "Dark mode";
  }
});

let urlBuilder = () =>{
    let amount = document.querySelector("input[name='amount']:checked").value;
    let category = document.querySelector("input[name='category']:checked").value;
    let difficulty = document.querySelector("input[name='difficulty']:checked").value;
    let type = document.querySelector("input[name='type']:checked").value;

    return "https://opentdb.com/api.php?amount="+amount+"&category="+category+
    "&difficulty="+difficulty+"&type="+type;     
};

let shuffle = (array) =>{
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

let getQuestions = async () => {
  let counter = 1;
  let answers = [];
  let points = 0;
  var quizContainer = document.createElement("div");;
  quizContainer.id = "questions-container";
  document.body.append(quizContainer);

  let data = await getData(urlBuilder());
  if(data.response === 1){
    alert("Sorry, not enough questions for this game-combination.")
  }
  data.results.forEach(param => { 
  
    if(param.type === "multiple"){
      answers = [param.correct_answer, param.incorrect_answers[0], 
        param.incorrect_answers[1], param.incorrect_answers[2]];
      shuffle(answers);
    }

  let qstDiv = document.createElement("div");
  qstDiv.id = "question-single"+counter;
  qstDiv.className = "question-single";
  quizContainer.appendChild(qstDiv);
  let type = document.querySelector(`input[name="type"]:checked`).value;
  qstDiv.innerHTML = answersType(type, counter, param, answers);
    
      counter++;
    })
    let submitDiv = document.createElement("div");
    let submitBtn = document.createElement("button");
    quizContainer.appendChild(submitDiv);
    submitBtn.innerText = "Submit";
    submitBtn.id = "submit-button";
    submitDiv.id = "submit-div";
    submitDiv.appendChild(submitBtn);

    submitBtn.addEventListener("click", () => {
      for(let i=1; i<=data.results.length; i++){
        let userAnswer = document.querySelector(`input[name="question${i}"]:checked`);
        if (userAnswer.value === data.results[i-1].correct_answer){
          document.getElementById("result"+i).innerHTML = "RIGHT ANSWER!!!";
          document.getElementById("question-single"+i).style.backgroundColor = "#66ff00";
          points++;
        }
        else{
          document.getElementById("result"+i).innerHTML = "Wrong...";
          document.getElementById("question-single"+i).style.backgroundColor = "#ff073a";
        }
      }
      let total = document.createElement("div");
      total.id = "total-score";
      quizContainer.appendChild(total);
      let maxPoints = counter-1;

      if(points < (maxPoints/2)){
        document.getElementById("total-score").innerHTML = "I thought you were better then this...";
        document.getElementById("total-score").style.backgroundColor = "#ff073a";
      }
      else if(points >= (maxPoints/2) && points < (maxPoints * 0.75)){
        document.getElementById("total-score").innerHTML = "You made it!";
        document.getElementById("total-score").style.backgroundColor = "#ccff02";
      }
      else if(points >= (maxPoints * 0.75)){
        document.getElementById("total-score").innerHTML = "Amazing!!!";
        document.getElementById("total-score").style.backgroundColor = "#66ff00";
      }
    })
    let refreshBtn = document.createElement("button");
    submitDiv.appendChild(refreshBtn);
    refreshBtn.innerText = "New Game";
    refreshBtn.id = "refresh-button";
    refreshBtn.addEventListener("click", () => {
      quizContainer.remove();
    });
};


let startBtn = document.getElementById('button-start');
startBtn.addEventListener("click", () => {
  if(document.querySelector('input[name="difficulty"]:checked') 
  && document.querySelector('input[name="amount"]:checked') 
  && document.querySelector('input[name="category"]:checked') 
  && document.querySelector('input[name="type"]:checked')){
    getQuestions(urlBuilder);
  }
});

let answersType = (type, counter, param, answers)=>{
  if(type === "boolean"){
    return '<div class="question-title">'
    +  '<h3 id="result'+counter+'">Question '+counter+'</h3>'
    +  '<h3 class="h3-highlight2"><strong>'+param.question+'</strong></h3>'
    +'</div>'
    +'<div class="question-input-div">'
    +  '<input type="radio" name="question'+counter+'" id="true'+counter+'" value="True"/>'
    +  '<label for="true'+counter+'">True</label>'
    +  '<input type="radio" name="question'+counter+'" id="false'+counter+'" value="False"/>'
    +  '<label for="false'+counter+'">False</label>'
    + '</div>';
  }
  else if(type === "multiple"){
    return     '<div class="question-title">'
    +  '<h3 id="result'+counter+'">Question '+counter+'</h3>'
    +  '<h3 class="h3-highlight2"><strong>'+param.question+'</strong></h3>'
    +'</div>'
    +'<div class="question-input-div">'
    +  '<input type="radio" name="question'+counter+'" id="one'+counter+'" value="'+answers[0]+'"/>'
    +  '<label for="one'+counter+'">'+answers[0]+'</label>'
    +  '<input type="radio" name="question'+counter+'" id="two'+counter+'" value="'+answers[1]+'"/>'
    +  '<label for="two'+counter+'">'+answers[1]+'</label>'
    +  '<input type="radio" name="question'+counter+'" id="three'+counter+'" value="'+answers[2]+'"/>'
    +  '<label for="three'+counter+'">'+answers[2]+'</label>'
    +  '<input type="radio" name="question'+counter+'" id="four'+counter+'" value="'+answers[3]+'"/>'
    +  '<label for="four'+counter+'">'+answers[3]+'</label>'
    +'</div>';
  }
}

