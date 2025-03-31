PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

Sequence(
  "intro-high-sd",
  "consent",
  "personal-info",
  "pre-trial",
  "trial",
  "trialend",
  "experiment",
  "experimentend",
  "ManipulationCheck",
  "MCDSintructions",
  "MCDSQuestionaire",
  SendResults(),
  "end"
);

// Showing page with instructions, in a html file that you can edit
newTrial("intro-high-sd", newHtml("intro-high-sd.html").print(), newButton("Continue").center().print().wait());

newTrial("consent", defaultText.print().center(), newHtml("consent", "consent.html").print().center(), newKey("spacebar", " ").wait());

newTrial(
  "personal-info",
  newText("Please enter your age:"),
  newTextInput("input_age").cssContainer({ "margin-bottom": "1em" }).center().print(),
  newVar("age").global().set(getTextInput("input_age")),
  newText("Please select your gender:"),
  newScale("scale_gender", "Male", "Female", "Non-binary").cssContainer({ "margin-bottom": "1em" }).center().print(),
  newVar("gender").global().set(getScale("scale_gender")),
  newText("Please enter your ocupation:"),
  newTextInput("input_occupation").cssContainer({ "margin-bottom": "1em" }).center().print(),
  newVar("occupation").global().set(getScale("input_occupation")),
  newButton("Next").center().hidden().print().wait()
)
  .log("age", getVar("age"))
  .log("gender", getVar("gender"))
  .log("occupation", getVar("occupation"));

newTrial(
  "pre-trial",
  defaultText.print().center(),
  newHtml("pretrial", "pretrial.html").print().center(),

  newButton("Start with the trials").center().print().wait()
);

// Starting with the trial section
Template("trialitems.csv", (row) =>
  newTrial(
    "trial",

    newText("question", row.question).center().print(),
    newScale("response", row.answer1, row.answer2, row.answer3, row.answer4, row.answer5)
      .center()
      .labelsPosition("top")
      .callback(getButton("Next").visible())
      .size("auto")
      .print(), // Adding the scale to answer
    newButton("Next").center().hidden().print().wait()
  )
);

newTrial("trialend", newHtml("trialend.html").print(), newButton("Go to the next section").center().print().wait());

// Starting the experiment, by using data from csv file we made previously
Template("expitems.csv", (row) =>
  newTrial(
    "experiment",
    newText("question", row.question).center().css("height", "75px").print(),
    newTimer("RT", 120000) // Set the timer in a standard starting point (2 mins)
      .start(),
    newMouseTracker("mouse") // Starting the mouse tracking
      .log()
      .start(),
    newScale("response", row.answer1, row.answer2, row.answer3, row.answer4, row.answer5)
      .center()
      .labelsPosition("top")
      .callback(getButton("Next").visible())
      .size("auto")
      .print()
      .log(), // Adding the scale to answer
    newButton("Next").center().hidden().print().wait(),
    // Stop RT
    getTimer("RT").stop(),
    // Save RT
    newVar("RT").global().set(getTimer("RT").value),
    // Stop the mouse tracking
    getMouseTracker("mouse").stop()
  )
);

newTrial("experimentend", newHtml("experimentend.html").print(), newButton("Show statement").center().print().wait());

newTrial(
  "ManipulationCheck",

  newText("question", "I felt that my answers are going to be kept anonymous").center().print(),
  newScale("response", "Strongly disagree", "Disagree", "Not agree nor disagree", "Agree", "Strongly agree")
    .center()
    .labelsPosition("top")
    .callback(getButton("Next").visible())
    .size("auto")
    .log()
    .print(), // Adding the scale to answer
  newButton("Next").center().hidden().print().wait()
);

newTrial(
  "MCDSintructions",

  newHtml("MCDSinstr.html").print(),
  newButton("Go to the final section").center().print().wait()
);

Template("FinalQ.csv", (row) =>
  newTrial(
    "MCDSQuestionaire",

    newText("question", row.question).center().print(),
    newScale("response", "True", "False").center().labelsPosition("top").callback(getButton("Next").visible()).log().size("auto").print(), // Adding the scale to answer
    newButton("Next").center().hidden().print().wait()
  )
);

newTrial("end", exitFullscreen(), newHtml("end.html").print(), newButton().wait()).setOption("countsForProgressBar", false);
