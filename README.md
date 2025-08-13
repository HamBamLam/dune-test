# Dune Test - Goal

The goal of this project is to build and deliver a SCORM 2004 learning module that plays a short training video on password security and then presents a 5-question multiple-choice quiz. The learner must:

    Watch the entire video 
    Score ≥80% on the quiz to pass 


The module must correctly report SCORM 2004 data points to the LMS, including completion, success status, scaled/raw score, progress, and session time.


## Design Process

- When designing this module, I wanted to keep the design relatively simple while still allowing it to be modular and readable enough to be applied to any future works. I decided to keep the design simple for several reasons, but the most important was that the goal of this project was very simple; if I were to spend a large amount of time on style and design elements, I woul dend upo spending far more time on them than the actual functional requirements. I had never used the SCORM API before this, so I first perused publicly available examples to see how they functioned. Once I felt I understood them, I decided on a basic file structure:
```
root/
├── Password_Video.html
├── Quiz.html
├── scormfunctions.js
├── quiz_functions.js
├── imsmanifest.xml
└── passwords.mp4
```
- I originally decided to keep the video and quiz on separate html files, but instead changed to a single html to avoid added complexity due to how the SCORM API works. The idea was for the scormfunctions.js file to act as a wrapper for all the API calls by making some small changes to a basic example module and then the quiz_functions.js file would hold all of the logic required for the quiz to ensure the html did not become too cluttered and to allow the file to be reusable for other projects.

- For the functionality, what I wanted to do was simple:
    - Prevent skipping the video through scrubbing
    - Have a button that would become clickable only when the video is finished which would navigate to the quiz
    - Allow users to skip the video if they had watched it in a previous session in case of disconnects
    - Simple 5 question quiz using multiple choice and multi-select questions
    - Exit once the quiz is submitted and announce the user's score
- I thought that these goals would meet the requirements while also having enough QoL features for the module to still be effective and not frustrating to use

## Design Changes for a Branching Structure
- If I were to design a module with multiple videos and branching logic, I would have to change the structure a bit. I wouldn't use a single html file for all of the pages, since this would become very cumbersome. Most likely, it would be as follows:
    - I would use a single html file to act as a "shell page" which could load the other html files into a contentFrame. 
    - The actual content of the module(quizzes, videos) would be in separate html files 
    - The shell page would hold an array of the URLs of the other html files
    - Navigation would be done using a simple "next/prev" button set
    - Branching logic would be handled by changing the "next/prev" destination
        - each array element would be the page url, prev destination, alternate prev dest, next destination, alternate next dest
        - based on branch condition(ex: test score), shell page loads either standard or alternate index on button click
- These changes would allow each html file to be clean and readable without requiring multiple SCOs, which would, for a system with branching logic, require significant work with SCORM sequencing.
