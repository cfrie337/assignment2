const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';

/*
 To get a specific play, add play's id property (in plays.json) via query string,
   e.g., url = url + '?name=hamlet';

 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=hamlet
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=jcaesar
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=macbeth

 NOTE: Only a few plays have text available. If the filename property of the play is empty,
 then there is no play text available.
*/


/* note: you may get a CORS error if you test this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/

/*****************************************************************************************************************/
/* Online Resources Used:
      https://developer.mozilla.org/ for things such as sort and localStorage and all kinds of other documentation
      https://www.youtube.com/watch?v=BbuLjEqFlw0 for more sorting help

*/

/* Known Bugs/Mistakes:
      -Filter and Close buttons do not work
      -No "credits" button in header
      -Redundant code for view button due to misreading instructions and not having enough time to restructure
      -Long functions that could be cleaned up and restructured
*/

/* Comments:
      Unfortunatley I had a busy few weeks and didn't spend as much time as I would have liked on this
      assignment. I ran out of time and couldn't finish. There are things I would have liked to re-organize
      and restructure to make it much more readable as well. I actually really enjoyed this assignment!
*/
/*****************************************************************************************************************/

fetch("./plays.json")
  .then(resp => resp.json())
  .then(data => {
    const ul = document.querySelector("#playList ul");
    const radioButtons = document.querySelectorAll("input[name='sort']");

    //create an unordered list of li elements (play names)
    for (let d of data) {
      const li = document.createElement("li");
      li.setAttribute("data-id", d.id);
      li.textContent = d.title;
      li.addEventListener("click", () => { //add event listener to each play
        displayDetails(d); //once a play is clicked, display its details
      });
      ul.appendChild(li);
    }

    radioButtons.forEach(radioButton => {
      radioButton.addEventListener("change", () => { sortSelected(data) });
    });

  });

//takes info (data from JSON file) for the play the user wants to view, and accesses the new data
//from the API (unless it is stored in local storage) by using the plays id.
function accessPlay(info) {
  let dataString = ""; //string to store API data
  const selectedPlayColumnOne = document.querySelector("#selectedPlayColOne");
  const selectedPlayColumnTwo = document.querySelector('#selectedPlayColTwo');
  const oldButton = document.querySelector("#btnViewPlayText");
  const fieldsets = document.querySelectorAll("fieldset");
  const newButton = document.querySelector("#btnClose");
  const url = api + `?name=${info.id}`;

  selectedPlayColumnOne.style.display = "none"; //hide mid column info
  selectedPlayColumnTwo.style.display = "none"; //hide last column info
  oldButton.style.display = "none"; //hide the view button

  for (let f of fieldsets) { //display all fieldsets that were previously hidden
    f.style.display = "block";
  }
  interface.style.display = "block"; //display interface
  newButton.style.display = "block"; //display close button

  //check to see if its already in local storage, if not, add it (stored as {'id':'{...}'})
  if (localStorage.getItem(info.id) === null) {
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        dataString = JSON.stringify(data);
        localStorage.setItem(info.id, dataString);
        showPlay(info.filename, data); //display plays content
      });
  }
  else { //if it is, create data object and pass it to showPlay()
    const dataObj = JSON.parse(localStorage.getItem(info.id)); //stores the data string as an object
    console.log(dataObj);
    showPlay(info.filename, dataObj); //display plays content
  }
  //test
  console.log(localStorage);
}

//displays the plays content if it is available
function showPlay(filename, data) {
  const noPlay = document.querySelector("#noPlay");
  //the play elements
  const thePlay = document.querySelector("#thePlay");
  //interface elements
  const interface = document.querySelector("#interface");
  const interfaceTitle = document.createElement("h2");

  interface.replaceChildren(); //removes all children of interface aside
  thePlay.replaceChildren(); //removes all children of thePlay section

  if (filename === "") {
    thePlay.style.display = "none"; //hide play content
    noPlay.style.display = "block"; //display no play found message
    interface.appendChild(interfaceTitle);
    interfaceTitle.textContent = "No Play Info";
  }
  else {
    const acts = data.acts;
    const actScenePairs = {};
    //column two
    const actList = document.createElement("select");
    const sceneList = document.createElement("select");
    const emptyOption1 = document.createElement("option");
    const emptyOption2 = document.createElement("option");
    //column three
    const titleLong = document.createElement("h2");

    thePlay.style.display = "block";
    noPlay.style.display = "none";

    //COLUMN TWO
    //title
    interface.appendChild(interfaceTitle);
    interfaceTitle.textContent = data.short;
    //act select
    actList.setAttribute("id", "actList");
    interface.appendChild(actList);
    sceneList.setAttribute("id", "sceneList");
    interface.appendChild(sceneList);

    actList.appendChild(emptyOption1);
    emptyOption1.setAttribute("value", "");

    sceneList.appendChild(emptyOption2);
    emptyOption2.setAttribute("value", "");

    actList.addEventListener("change", () => {
      addSceneOptions(actList.value, actScenePairs); //scene select
    });
    interfaceFieldSet(data); //make the inner interface fieldset

    //COLUMN THREE
    //title
    thePlay.appendChild(titleLong);
    titleLong.textContent = data.title;

    //the acts
    for (let a of acts) {
      const actOption = document.createElement("option");
      const theAct = document.createElement("article");
      const actName = document.createElement("h3");
      const scenes = a.scenes;
      const sceneArray = [];

      //actList
      actList.appendChild(actOption);
      actOption.setAttribute("value", a.name);
      actOption.textContent = a.name;

      //act names
      theAct.setAttribute("id", "theAct");
      thePlay.appendChild(theAct);
      actName.textContent = a.name;
      theAct.appendChild(actName);

      //the scenes
      for (let s of scenes) {
        //const sceneOption = document.createElement("option");
        const theScene = document.createElement("div");
        const sceneName = document.createElement("h4");
        const sceneTitle = document.createElement("p");
        const sceneDirection = document.createElement("p");
        const speeches = s.speeches;

        sceneArray.push(s.name);

        //scene name/number
        theScene.setAttribute("id", "theScene");
        theAct.appendChild(theScene);
        theScene.appendChild(sceneName);
        sceneName.textContent = s.name;
        //scene title
        sceneTitle.setAttribute("class", "title");
        theScene.appendChild(sceneTitle);
        sceneTitle.textContent = s.title;
        //scene stage direction
        sceneDirection.setAttribute("class", "direction");
        theScene.appendChild(sceneDirection);
        sceneDirection.textContent = s.stageDirection;

        //the speeches
        for (let sp of speeches) {
          const speech = document.createElement("div");
          const speaker = document.createElement("span");
          const lines = sp.lines;

          speech.setAttribute("class", "speech");
          theScene.appendChild(speech); //append speech div to theScene div
          speech.appendChild(speaker); //append span to speech div

          speaker.textContent = sp.speaker; //add text to span

          //the lines
          for (let l of lines) {
            const line = document.createElement("p");

            speech.appendChild(line); //append line to speech div
            line.textContent = l; //add text to line <p>
          }
        }
      }
      actScenePairs[a.name] = sceneArray;
    }
    console.log(actScenePairs);
  }
}

function addSceneOptions(value, actScenePairs) {
  const interface = document.querySelector("#interface");
  const sceneList = document.querySelector("#sceneList");
  const select = document.querySelector("#sceneList");
  const scenes = actScenePairs[value];

  sceneList.replaceChildren();
  for (let s of scenes) {
    const sceneOption = document.createElement("option");

    sceneList.appendChild(sceneOption);
    sceneOption.setAttribute("value", s);
    sceneOption.textContent = s;
  }
}

function interfaceFieldSet(data) {
  const interface = document.querySelector("#interface");
  const fieldset = document.createElement("fieldset");
  const select = document.createElement("select");
  const option = document.createElement("option");
  const input = document.createElement("input");
  const button = document.createElement("button");

  interface.appendChild(fieldset);

  //select
  fieldset.appendChild(select);
  select.setAttribute("id", "playerList");
  select.appendChild(option);
  option.setAttribute("value", 0);
  option.textContent = "All Players";

  //input
  fieldset.appendChild(input);
  input.setAttribute("type", "text");
  input.setAttribute("id", "textHighlight");
  input.setAttribute("placeholder", "Enter a search term");
  //button
  fieldset.appendChild(button);
  button.setAttribute("id", "btnHighlight");
  button.textContent = "Filter";

  fieldset.style.display = "block";
}

//creates and returns an <a> element with a url and text content
function createLink(url, content) {
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.textContent = content;

  return link;
}

function displayDetails(data) {
  //display states
  const preSelection = document.querySelector("#preSelection")
  const noPlay = document.querySelector("#noPlay");
  const thePlay = document.querySelector("#thePlay");
  //areas of display
  const selectedPlayColumnOne = document.querySelector("#selectedPlayColOne");
  const selectedPlayColumnTwo = document.querySelector('#selectedPlayColTwo');
  //mid column interface
  const viewButton = document.querySelector("#btnViewPlayText");
  const interface = document.querySelector("aside #interface");
  const closeButton = document.querySelector("aside #btnClose");
  //info  in last column
  const playsTitle = document.querySelector("#selectedPlayColOne #playsTitle");
  const p = document.querySelector("#selectedPlayColOne #playsSynopsis");
  const playsDate = document.querySelector("#selectedPlayColTwo #playsDate")
  const playsGenre = document.querySelector("#selectedPlayColTwo #playsGenre");
  const playsWiki = document.querySelector("#selectedPlayColTwo #playsWiki");
  const playsGutenberg = document.querySelector("#selectedPlayColTwo #playsGutenberg");
  const playsSSOrg = document.querySelector("#selectedPlayColTwo #playsSSOrg");
  const playsDesc = document.querySelector("#selectedPlayColTwo #playsDesc");
  //links
  const wikiLink = createLink(data.wiki, "Wiki Link");
  const gutenbergLink = createLink(data.gutenberg, "Gutenberg Link");
  const ssOrgLink = createLink(data.shakespeareOrg, "Shakespeare.org Link");

  interface.style.display = "none"; //hide interface
  closeButton.style.display = "none"; //hide interface button
  noPlay.style.display = "none"; //hide the no play message
  thePlay.style.display = "none"; //hide the play content

  selectedPlayColumnOne.style.display = "block"; //display mid column info
  selectedPlayColumnTwo.style.display = "block"; //display last column info

  //first column details (title, synposis, button)
  playsTitle.textContent = data.title;
  p.textContent = data.synopsis;
  if (data.filename === "") {
    viewButton.style.display = "none";
  }
  else {
    viewButton.style.display = "block";
    viewButton.addEventListener("click", () => { accessPlay(data) }); //if view button is clicked access plays api info
  }

  //second column details (date, genre, wiki link, gutenberg link, shakespeare link and plays description)
  preSelection.style.display = "none"; //hide the message displayed before a play was selected

  playsDate.textContent = `Date: ${data.likelyDate}`;
  playsGenre.textContent = `Genre: ${data.genre}`;
  playsWiki.replaceChildren();
  playsWiki.appendChild(wikiLink);
  playsGutenberg.replaceChildren();
  playsGutenberg.appendChild(gutenbergLink);
  playsSSOrg.replaceChildren();
  playsSSOrg.appendChild(ssOrgLink);
  playsDesc.textContent = `Description: ${data.desc}`;
}

//sorts list based on radio button selected
function sortSelected(data) {
  let selected = document.querySelector("input[name='sort']:checked").value;
  const section = document.querySelector("#playList");
  const ul = document.querySelector("#playList ul");
  const newList = document.createElement("ul");

  section.removeChild(ul); //remove old list

  //sort (0> is b before a, <0 is a before b, ===0 remains the same)
  if (selected === "name") { //if radio button is name, sort data by title
    data.sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    console.log(data);
  }
  else if (selected === "date") { //if radio button is date, sort data by likelyDate
    data.sort((a, b) => {
      if (a.likelyDate < b.likelyDate) {
        return -1;
      }
      if (a.likelyDate > b.likelyDate) {
        return 1;
      }
      return 0;
    });
    console.log(data);
  }

  //create new unordered list of li elements in their new order
  for (let d of data) {
    const li = document.createElement("li");
    li.setAttribute("data-id", d.id);
    li.textContent = d.title;
    li.addEventListener("click", () => { //add new event listener to each play
      displayDetails(d); //once a play is clicked, display its details
    });
    newList.appendChild(li); //append list to new ul
  }

  section.appendChild(newList); //append ul to section
}