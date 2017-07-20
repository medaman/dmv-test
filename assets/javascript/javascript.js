$(document).ready(function() {
  var dmvTest = {
    currentQuestions: [],
    questionNumber: 0,
    incorrectAnswers: 0,
    correctAnswers: 0,

    timer: {
      time: 30,
      start: function() {
        $("#time-remaining").html("30");
        dmvTest.timer.time = 30;
        dmvTest.interval = setInterval(dmvTest.timer.count, 1000);
      },
      count: function() {
        dmvTest.timer.time--;
        $("#time-remaining").html(dmvTest.timer.time);
      },
      stop: function() {
        clearInterval(dmvTest.interval);
      }
    }
  }

  $("#start-button").on("click", function() {
    $("#start-screen").css("visibility", "hidden");
    restartTest();
    startTest();
  });

  function startTest() {
    var answered = false;
    if (dmvTest.correctAnswers === 24) {
      $("#result").html("<p>You passed</p> <button id='inner-restart'>Restart</button>")
    } else if (dmvTest.incorrectAnswers < 6) {
      $("#answer-area").html("");
      $("#result").html("");
      decideQuestions();
      displayQuestion(dmvTest.questionNumber);

      dmvTest.timer.start();
      dmvTest.startRound = setTimeout(function() {
        $("#result").html("Times Up!");
        $("#button"+dmvTest.currentQuestions[dmvTest.questionNumber].answer).css("background-color","green");
          dmvTest.incorrectAnswers++;
          dmvTest.timer.stop();
          $("#time-remaining").html(0);
          answered = true;
      }, 30000);
      dmvTest.endRound = setTimeout(function() {
        dmvTest.questionNumber++;
        startTest();
      }, 32500);
      
      $(".answer-button").on("click", function() {
        if(!answered) {
          if(parseInt($(this).attr("value")) === dmvTest.currentQuestions[dmvTest.questionNumber].answer) {
            $("#result").html("Correct!");
            clearTimeout(dmvTest.startRound);
            clearTimeout(dmvTest.endRound);
            dmvTest.timer.stop();
            dmvTest.correctAnswers++;
            dmvTest.correctAnswer = setTimeout(function() {
              dmvTest.questionNumber++;
              startTest();
            }, 2500);
            $(this).css("background-color","green");
          } else {
            $("#result").html("Incorrect.");
            dmvTest.timer.stop();
            dmvTest.incorrectAnswers++;
            clearTimeout(dmvTest.startRound);
            clearTimeout(dmvTest.endRound);
            dmvTest.incorrectAnswer = setTimeout(function() {
              dmvTest.questionNumber++;
              startTest();
            }, 2500);
            $(this).css("background-color","red");
            $("#button"+dmvTest.currentQuestions[dmvTest.questionNumber].answer).css("background-color","green");
          }
          answered = true;
        }
      });
    } else {
      $("#result").html("<p>You failed</p> <button id='inner-restart'>Restart</button>")
    }
    $("#correct-answers").html(dmvTest.correctAnswers);
    $("#incorrect-answers").html(dmvTest.incorrectAnswers);
    $("#questions-remaining").html(30-dmvTest.questionNumber);
  }

  function decideQuestions() {
    var pickedQuestions = [];
    var rand = Math.floor(Math.random() * 48);
    for(var i=0; i<30; i++) {
      while (pickedQuestions.includes(rand)) {
        rand = Math.floor(Math.random() * 48);
      }
      pickedQuestions.push(rand);
      dmvTest.currentQuestions.push(questionList[rand]);
    }
  }

  function displayQuestion(num) {
    $("#question").html((dmvTest.questionNumber + 1) + ". " + dmvTest.currentQuestions[num].question);
    for(var i=1; i<=3; i++) {
      var newAnswer = $("<button>");
      newAnswer.attr("class", "answer-button")
      newAnswer.attr("value", i)
      newAnswer.attr("id", "button" + i)
      newAnswer.html(dmvTest.currentQuestions[num]["option"+i]);
      $("#answer-area").append(newAnswer);
    }
  }

  function restartTest() {
    dmvTest.currentQuestions = [];
    dmvTest.questionNumber = 0;
    dmvTest.incorrectAnswers = 0;
    dmvTest.correctAnswers = 0;
    dmvTest.timer.stop();
    clearTimeout(dmvTest.startRound);
    clearTimeout(dmvTest.endRound);
    clearTimeout(dmvTest.correctAnswer);
    clearTimeout(dmvTest.incorrectAnswer);
  }

  $("#main-restart").on("click", function() {
    if(confirm("Are you sure you would like to restart the test? All progress will be lost.")) {
      $("#start-screen").css("visibility", "visible");
      restartTest();
    }
  });

  $("body").on("click", "#inner-restart", function() {
      $("#start-screen").css("visibility", "visible");
      restartTest();
  });

})