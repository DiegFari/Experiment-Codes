PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// Show the consent first, then intro page with instructions
// then all the 'experiment' trials in a random order, then send the results and finally show the trial labeled 'end'
Sequence(
  "consent",
  "intro",
  "trial",
  "trial_end",
  "experiment",
  "Message",
  "ManipulationCheck",
  "MCDSQuestionaire",
  SendResults(),
  "end"
);

// Showing consent, stored in a html file that you can edit
newTrial(
  "consent",
  defaultText.print().center(),
  newHtml("consent", "consent.html").print().center(),
  newText(
    "instructions",
    "Press the spacebar to give consent to the experiment."
  )
    .print()
    .center(),
  newKey("spacebar", " ").wait()
);

// Showing page with instructions, in a html file that you can edit
newTrial(
  "intro",
  newHtml("intro.html").print(),
  newButton("Continue").center().print().wait()
);

// Starting with the trial section
Template("trialitems.csv", (row) =>
  newTrial(
    "trial",

    newText("question", row.question).center().print(),
    newScale(
      "response",
      row.answer1,
      row.answer2,
      row.answer3,
      row.answer4,
      row.answer5
    )
      .center()
      .labelsPosition("top")
      .size("auto")
      .print(), // Adding the scale to answer
    newButton("Next").center().print().wait()
  )
);

newTrial(
  "trial_end",
  newText(
    "You are now finished with the trial section. In the next section you will answer some questions regarding the interaction with chatbots (The template will be simplified from now on)."
  )
    .center()
    .print(),
  newButton("Go to the next section").center().print().wait()
);

// Starting the experiment, by using data from csv file we made previously
Template("expitems.csv", (row) =>
  newTrial(
    "experiment",
    newText("question", row.question).center().print(),
    newTimer("RT", 120000) // Set the timer in a standard starting point (2 mins)
      .start(),
    newMouseTracker("mouse") // Starting the mouse tracking
      .log()
      .start(),
    newScale(
      "response",
      row.answer1,
      row.answer2,
      row.answer3,
      row.answer4,
      row.answer5
    )
      .center()
      .labelsPosition("top")
      .size("auto")
      .print()
      .log(), // Adding the scale to answer
    newButton("Next").center().print().wait(),
    // Stop RT
    getTimer("RT").stop(),
    // Save RT
    newVar("RT").global().set(getTimer("RT").value),
    // Stop the mouse tracking
    getMouseTracker("mouse").stop()
  )
);

newTrial(
  "Message",

  newText(
    "The Target questions are finished, but there are still some questions to be answered"
  )
    .center()
    .print(),

  newButton("Go to the next section").center().print().wait()
);

newTrial(
  "ManipulationCheck",

  newText("I felt that my answers are going to be kept anonymous")
    .center()
    .print(),
  newScale(
    "response",
    "Strongly disagree",
    "Disagree",
    "Not agree nor disagree",
    "Agree",
    "Strongly agree"
  )
    .center()
    .labelsPosition("top")
    .size("auto")
    .log()
    .print(), // Adding the scale to answer
  newButton("Next").center().print().wait()
);

Template("FinalQ.csv", (row) =>
  newTrial(
    "MCDSQuestionaire",

    newText("question", row.question).center().print(),
    newScale("response", "True", "False")
      .center()
      .labelsPosition("top")
      .log()
      .size("auto")
      .print(), // Adding the scale to answer
    newButton("Next").center().print().wait()
  )
);

// The end of the experiment
newTrial(
  "end",
  exitFullscreen(),
  newText("Thank you for your participation!").center().print(),
  // This is a dummy link, it won't actually validate submissions; use the link provided by your pooling platform
  newText(
    "<p><a href='https://www.pcibex.net/' target='_blank'>Click here to validate your submission</a></p>"
  )
    .center()
    .print(),
  // Wait on this page forever
  newButton().wait()
).setOption("countsForProgressBar", false);
