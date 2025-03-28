PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// Show the consent first, then intro page with instructions
// then all the 'experiment' trials in a random order, then send the results and finally show the trial labeled 'end'
Sequence(
  "consent",
  "intro",
  "trial",
  "experiment",
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
  newButton("Continue.").center().print().wait()
);

// Starting with the trial section
Template("trialitems.csv", (row) =>
  newTrial(
    "trial",

    newText("question", row.question).center().print(),
    newCanvas("scaleCanvas", 800, 200)
      .add(50, 50, newText(row.answer1).css("font-size", "12px")) // Adding label 1
      .add(200, 50, newText(row.answer2).css("font-size", "12px")) // Adding label 2
      .add(350, 50, newText(row.answer3).css("font-size", "12px")) // Adding label 3
      .add(500, 50, newText(row.answer4).css("font-size", "12px")) // Adding label 4
      .add(650, 50, newText(row.answer5).css("font-size", "12px")) // Adding label 5
      .add(50, 100, newScale("response", 5).center().radio().log().print()) // Adding the scale to answer
      .center()
      .print(),
    newButton("Next").center().print().wait()
  )
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
    newCanvas("scaleCanvas", 800, 200)
      .add(50, 50, newText("Never").css("font-size", "12px")) // Adding label 1
      .add(200, 50, newText("Few times").css("font-size", "12px")) // Adding label 2
      .add(350, 50, newText("Sometimes").css("font-size", "12px")) // Adding label 3
      .add(500, 50, newText("Often").css("font-size", "12px")) // Adding label 4
      .add(650, 50, newText("Really often").css("font-size", "12px")) // Adding label 5
      .add(50, 100, newScale("response", 5).center().radio().log().print()) // Adding the scale to answer
      .print(),
    newButton("Next").center().print().wait(),
    // Stop RT
    getTimer("RT").stop(),
    // Save RT
    newVar("RT").global().set(getTimer("RT").value),
    // Stop the mouse tracking
    getMouseTracker("mouse").stop()
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
