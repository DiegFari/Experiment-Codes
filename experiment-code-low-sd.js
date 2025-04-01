PennController.ResetPrefix(null); // Shorten command names (keep this line here))

DebugOff(); // Uncomment this line only when you are 100% done designing your experiment

Sequence(
  "intro",
  "consent-low-sd",
  "personal-info",
  "trial-start",
  "trial",
  "experiment-start-low-sd",
  "experiment",
  "manipulation-check-start",
  "manipulation-check",
  "sd-bias-start",
  "sd-bias",
  SendResults(),
  "end"
);

// Start by displaying an introduction and a consent form
newTrial("intro", newHtml("intro.html").print(), newButton("Continue").center().print().wait());

newTrial("consent-low-sd", defaultText.print().center(), newHtml("consent-low-sd", "consent-low-sd.html").print().center(), newKey("spacebar", " ").wait());

// Ask for some personal information from subjects
newTrial(
  "personal-info",
  newText("personal-info-title", "Personal information")
    .cssContainer({ "text-align": "center", "font-weight": "900", "font-size": "32px", margin: "1.8rem 10rem 3rem 10rem" })
    .center()
    .print(),
  newText("instructions-age", "Please enter your age (press 'enter' afterwards):")
    .cssContainer({ "text-align": "center", "font-size": "18px", margin: "0rem 10rem 1rem 10rem" })
    .center()
    .print(),
  newTextInput("input_age").cssContainer({ "text-align": "center", "font-size": "18px", margin: "0rem 10rem 2rem 10rem" }).center().print().wait(),
  newVar("age").global().set(getTextInput("input_age")),
  newText("instructions-gender", "Please select your gender:")
    .cssContainer({ "text-align": "center", "font-size": "18px", margin: "0rem 10rem 1rem 10rem" })
    .center()
    .print(),
  newScale("scale_gender", "Male", "Female", "Non-binary", "I would prefer not to specify")
    .css({ "text-align": "center", "font-size": "18px", margin: "0rem 10rem 2rem 10rem" })
    .labelsPosition("bottom")
    .center()
    .print()
    .wait(),
  newVar("gender").global().set(getScale("scale_gender")),
  newText("instructions-occupation", "Please enter your occupation (press 'enter' afterwards):")
    .cssContainer({ "text-align": "center", "font-size": "18px", margin: "0rem 10rem 1rem 10rem" })
    .center()
    .print(),
  newTextInput("input_occupation").cssContainer({ "text-align": "center", "font-size": "18px", margin: "0rem 10rem 2rem 10rem" }).center().print().wait(),
  newVar("occupation").global().set(getTextInput("input_occupation")),
  newText("instructions-save", "Please verify the data entered and then click on the 'Continue' button:")
    .cssContainer({ "text-align": "center", "font-size": "18px", margin: "0rem 10rem 1rem 10rem" })
    .center()
    .print(),
  newButton("Continue").cssContainer({ "margin-bottom": "5em" }).center().print().wait()
)
  .log("age", getVar("age"))
  .log("gender", getVar("gender"))
  .log("occupation", getVar("occupation"));

// Explain the first section (practice questions) and start displaying the questions (from 'trial-items.csv')
newTrial("trial-start", newHtml("trial-start", "trial-start.html").print().center(), newButton("Start").center().print().wait());

Template("trial-items.csv", (row) =>
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

// Explain the second section (target questions) and start displaying the questions (from 'experiment-items.csv')
newTrial("experiment-start-low-sd", newHtml("experiment-start-low-sd.html").print(), newButton("Start").center().print().wait());

Template("experiment-items.csv", (row) =>
  newTrial(
    "experiment",
    newText("question", row.question).center().css("height", "75px").print(),
    newTimer("RT", 120000) // Set the timer in a standard starting point (2 mins)
      .log()
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
      .log("all"),
    newButton("Next").center().hidden().print().wait(),
    getTimer("RT").stop(), // Stop RT
    getMouseTracker("mouse").stop() // Stop the mouse tracking
  )
    .log("question", row.question)
    .log("type", row.type)
);

// Explain the third section (manipulation check) and display a question
newTrial("manipulation-check-start", newHtml("manipulation-check-start.html").print(), newButton("Start").center().print().wait());

newTrial(
  "manipulation-check",

  newText("question", "I felt my answers were anonymous").center().print(),
  newScale("response", "Strongly disagree", "Disagree", "Not agree nor disagree", "Agree", "Strongly agree")
    .center()
    .labelsPosition("top")
    .callback(getButton("Next").visible())
    .size("auto")
    .log()
    .print(), // Adding the scale to answer
  newButton("Next").center().hidden().print().wait()
);

// Explain the final section (social desireability bias questions) and start displaying the questions (from sd-bias-items.csv)
newTrial("sd-bias-start", newHtml("sd-bias-start.html").print(), newButton("Start").center().print().wait());

Template("sd-bias-items.csv", (row) =>
  newTrial(
    "sd-bias",

    newText("question", row.question).center().print(),
    newScale("response", "True", "False").center().labelsPosition("top").callback(getButton("Next").visible()).log().size("auto").print(), // Adding the scale to answer
    newButton("Next").center().hidden().print().wait()
  )
);

newTrial("end", exitFullscreen(), newHtml("end.html").print(), newButton().wait()).setOption("countsForProgressBar", false);
