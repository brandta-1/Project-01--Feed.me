let apiURL = "";

$(function () {

  var r = document.querySelector(':root');

  //disable enter key, otherwise forms can be broken
  $(document).on('keydown', function (e) {
    if (e.keyCode == 13) {
      return false;
    }
  });


  let searchTypes = ["input", "input", "select", "select"];
  let activeSettings = [];

  //these values will eventually be used to call the edemam API
  let queryParams = {
    q: null,
    ingr: null,
    diet: null,
    health: null,
    cuisineType: null,
    mealType: null,
    dishType: null,
    calories: null,
    time: null,
    excluded: null,
    app_key: '7bbbe81cbe8b6c0236aed02fad02e1dc',
    app_id: 'ebc0f8c5'
  }

  //these are the lists for dropdown choices
  let dDsettings = {
    diet: [
      "balanced",
      "high-fiber",
      "high-protein",
      "low-carb",
      "low-fat",
      "low-sodium"
    ],
    health: [
      "alcohol-cocktail",
      "alcohol-free",
      "celery-free",
      "crustacean-free",
      "dairy-free",
      "DASH",
      "egg-free",
      "fish-free",
      "fodmap-free",
      "gluten-free",
      "immuno-supportive",
      "keto-friendly",
      "kidney-friendly",
      "kosher",
      "low-fat-abs",
      "low-potassium",
      "low-sugar",
      "lupine-free",
      "Mediterranean",
      "mollusk-free",
      "mustard-free",
      "no-oil-added",
      "paleo",
      "peanut-free",
      "pescatarian",
      "pork-free",
      "red-meat-free",
      "sesame-free",
      "shellfish-free",
      "soy-free",
      "sugar-conscious",
      "sulfite-free",
      "tree-nut-free",
      "vegan",
      "vegetarian",
      "wheat-free"
    ],
    cuisineType: [
      "American",
      "Asian",
      "British",
      "Caribbean",
      "Central Europe",
      "Chinese",
      "Eastern Europe",
      "French",
      "Indian",
      "Italian",
      "Japanese",
      "Kosher",
      "Mediterranean",
      "Mexican",
      "Middle Eastern",
      "Nordic",
      "South American",
      "South East Asian"
    ],
    mealType: [
      "Breakfast",
      "Dinner",
      "Lunch",
      "Snack",
      "Teatime"
    ],
    dishType: [
      "Biscuits and cookies",
      "Bread",
      "Cereals",
      "Condiments and sauces",
      "Desserts",
      "Drinks",
      "Main course",
      "Pancake",
      "Preps",
      "Preserve",
      "Salad",
      "Sandwiches",
      "Side dish",
      "Soup",
      "Starter",
      "Sweets"
    ]
  }


  $("select.selectVal").change(drawStuff);

  function drawStuff() {

    //the current element is the selected option in the select element that called drawStuff()
    let currEl = $(this).children("option:selected");

    //naive solution, see next 2 comments
    let x;

    //maintain an array of what our current search settings
    activeSettings = $("#settings").children().toArray();

    activeSettings.forEach((_, i) => {
      //TODO: just use a set, which forces uniqueness, no duplicates, maps are the same with key value pairs or map.has(keyImLookingFor)
      if ($(activeSettings[i]).attr("class") === currEl.attr("id")) {
        x = false;
        return;
      }
    });

    if (x === false) {
      return;
    }

    //create a search setting module. The module has a label, a search input type, and a delete button 
    $("#settings").append(
      $("<div>").attr("class", currEl.attr("id")).append(
        //create the label
        $("<label>").text(currEl.text()),
        //the search selection determines the html module's element type and id,  
        $("<" + searchTypes[currEl.val()] + ">").attr({ class: "search-option", id: currEl.attr("id") })));

    //last minute repair, this whole section can be optimized
    if (Number(currEl.val()) === 1) {
      $(".search-option").last().attr({ type: "number" });

    }
    //if the input type is a dropdown selector
    else if (Number(currEl.val()) > 1) {

      const currSel = $("select").last();

      //append options to the dropdown, the options are derived from dDsettings "drop down settings"
      dDsettings[currEl.attr("id")].forEach((_, i) => {
        currSel.append(
          $("<option>").attr("id", dDsettings[currEl.attr("id")][i]).text(dDsettings[currEl.attr("id")][i]),
        );
      })

      //set certain dropdowns to multiple. Again, this can be optimized
      if (Number(currEl.val()) === 3) {
        currSel.prop("multiple", "multiple");
      }

      //on selection in dropdown
      currSel.change((e) => {

        //retrieve the selected option(s) and convert it to an array
        //as an array, the map method can be used, which will return an array of id strings from the choice element (or array of choices)
        let theChoice = $(e.target)
          .children("option:selected")
          .toArray().map(({ id }) => id);

        //set the query parameter (whose id matches the current selector) to the selected choice(s)
        queryParams[currEl[0].id] = theChoice;

      })
    }

    //append a delete button to the created module
    $('.' + currEl.attr("id")).append(
      $("<button>").attr("id", "cancel-button").text("delete"));
  };

  function removeEl(event) {
    event.preventDefault();

    //select the module whose delete button was clicked
    const parentEl = $(event.target).parent();

    //set the deleted module's choices back to null
    const currId = parentEl[0].className
    queryParams[currId] = null;
    parentEl.remove();
  }

  $('#settings').on('click', 'button', removeEl);

  $('#search-button').on('click', testFunction);

  function testFunction(e) {
    e.preventDefault();

    //collect all inputs that are on the page, fill their values into the query parameters
    $(".search-option").toArray().forEach((_, i) => {
      let currSearchOption = $(".search-option").toArray()[i];

      //if the current search option was not a drop down selector
      if (currSearchOption.tagName === "INPUT") {
        //then just store its value into the query parameters
        queryParams[currSearchOption.id] = currSearchOption.value;
      } else {

        //otherwise, create an array from the selected children and store the selected options' values
        queryParams[currSearchOption.id] = Array.from(currSearchOption.children).filter((option) => option.selected).map(option => option.value);
      }
    })

    //filter null values
    let queryParamsF = Object.fromEntries(Object.entries(queryParams).filter(([_, i]) => i != null && i != [] && i != ""));



    //create an array from the query parameters, then creates the resulting string
    const test = Object.keys(queryParamsF).reduce((acc, currKey) => {

      currVal = queryParamsF[currKey];

      let qParam = `${currKey}=${currVal}`;
      if (Array.isArray(currVal)) {
        //if it is an array, reduce it to another array of just the value and the query param of strings
        //take that array of strings, and join them with an ampersand (see api docs, see api docs for "exclude" specifically)
        qParam = currVal.reduce((a, c) => [...a, `${currKey}=${c}`], []).join('&');
      } else if (currKey === "excluded") {
        qParam = currVal.split(",").reduce((a, c) => [...a, `${currKey}=${c.trim()}`], []).join('&');
      }

      //return the current accumulated array with a new value added onto it (can be optimized by using map instead)
      return [...acc, qParam];
    }, []).join('&');

    apiURL = "https://api.edamam.com/api/recipes/v2?type=public&" + test;

    //the api url is ready
    DrawResults(apiURL);
  }




  async function DrawResults(apiURL) {

    let apiObject = await processURL(apiURL);

    $('.controlgroup').empty()

    var recipeArray = apiObject.hits

    if (recipeArray.length === 0) {
      $('.controlgroup').append(
        $('<h2>').text("No recipes found, try again")
      )
    }

    $('#result-lim').val() > 0 ? resultLimit = $('#result-lim').val() : resultLimit = recipeArray.length

    for (let i = 0; i < resultLimit - 1; i++) {
      // creates an h2 element that text content is the same as 'label' inside the api!
      let recipesnames = $('<h2>').text(recipeArray[i].recipe.label);
      // make controlgroup append child 'recipenames'
      $('.controlgroup').append(recipesnames);
      // create a img element that src content the same as recipe images in api!
      let image = $('<img>').attr('src', recipeArray[i].recipe.image);
      // make controlgroup append child 'image'
      $('.controlgroup').append(image);
      // create a p element that text content is the same as 'calories' inside the api!
      let calories = $('<p>').text(recipeArray[i].recipe.calories)
      // make calories text content into a string'
      calories.text().toString()
      // make calories text content split and join
      var formatedcalories = calories.text().split('', 3).join('');
      console.log(calories)
      // create a p element that text content is the same as the variable 'formatedcalories' inside the api!
      calories = $('<p>').text('Calories: ' + formatedcalories)
      // make controlgroup append child 'calories'
      $('.controlgroup').append(calories)
      // make a button element

      // make the instructionsbutton variable a for loop!
      var instrutionslink = $('<a>')
      // add attribute href to the link element which contrains the same as recipe url inside the api!
      instrutionslink.attr('href', recipeArray[i].recipe.url);
      // add instrutionslink text content!
      instrutionslink.text('Instructions');
      // make controlgroup append child 'instrutionsbutton'
      $('.controlgroup').append(instrutionslink)
      // make <a> elements
      // make instrutionsbutton append child 'instrutionslink
      // make a button element
      var savebutton = $('<button>')
      // make button text content!
      savebutton.text('Save Button')
      savebutton.attr({
        id: "button-" + i,
        class: "save-button"
      });
      // make button a for loop
      // .countrolgruop append child 'savebutton'
      $('.controlgroup').append(savebutton)



    }


    // when save button is clicked.......
    $('.save-button').on('click', function (event) {
      // make localstorage 'savedlink' an object
      var pushes = JSON.parse(localStorage.getItem('savedlink')) || [];
      // push recipes url content inside the localstorage

      let thisIndex = event.target.id.slice(-1);
      $("#" + event.target.id).text("recipe saved!")
      pushes.push(recipeArray[thisIndex].recipe.url);
      // creates a localstorage 'savelink' and sets it as a string!
      localStorage.setItem('savedlink', JSON.stringify(pushes));

    });



  }

  async function processURL(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  }

  async function drawPage() {

    //retrieve 4 seasonal holidays from the holiday API
    let apiObject = await processURL("https://holidayapi.com/v1/holidays?pretty&key=ea79cfef-e556-4497-90ca-54de8fcc2e17&country=US&year=2022");

    let holidays = [
      apiObject.holidays[22].date.slice(5),
      apiObject.holidays[77].date.slice(5),
      apiObject.holidays[107].date.slice(5),
      apiObject.holidays[136].date.slice(5)
    ]

    let distances = [];

    let today = dayjs(dayjs().format('MM-DD'));

    //find how far away each holiday is from today
    holidays.forEach((_, i) => {
      distances[i] = Math.abs(today.diff(holidays[i], 'day'))
    })

    //holiday color themes 
    let colorSets = [
      ["#0F7E0B",
        "#f9f9f9",
        "#EF831D",
        "#EF831D",
        "#f1f1f1",
        "#030e2e"],
      ["#FF0104",
        "#F3EEEE",
        "#2E2EEF",
        "#BA0204",
        "#908B8B",
        "#030380"],
      ["#080500",
        "#FC9F06",
        "#A17F46",
        "#5f0580",
        "#F8E3AD",
        "#B1AFAB"],
      ["#056705",
        "#888888",
        "#FC0000",
        "#E3E3E3",
        "#3BA94D",
        "#EBDE72"]
    ]
   
    let holidayIndex = 5;
    //if today is within 14 days of a holiday (before or after), then set the pages colors to that holiday's color theme
    distances.forEach((_, i) => {
      if (distances[i] <= 14) {
        holidayIndex = i
        return;
      }
    });

    if (holidayIndex < 5) {
      for (var i = 0; i < 6; i++) {
        r.style.setProperty('--color' + i, colorSets[holidayIndex][i]);
      }
    }
  }

  drawPage();

  
  var savedModal = document.getElementById('savedRecipesModal');
  var savedBtn = document.getElementById('saved-recipes-btn');
  var closeBtn = document.getElementById('close-btn');
 
  savedBtn.addEventListener('click', function () {
    savedModal.classList.remove('hidden');
    console.log("modal openede");
    var savedLinks = JSON.parse(localStorage.getItem('savedlink'));
    if (savedLinks && savedLinks.length > 0) {
      $(".saved-recipes-list").empty();
      savedLinks.forEach(function (link) {
        var recipeLink = document.createElement('a');
        recipeLink.href = link;
        recipeLink.textContent = link;

        $(".saved-recipes-list").append($("<a>").text(recipeLink).attr("href", recipeLink));
      });
    } else {
      $('.modal-body').text('you have not saved any yet'); //if there is no saved links in storage show this message
    }
    console.log("testing");
    document.getElementById("savedRecipesModal").style.display = "block";
  });
  closeBtn.addEventListener('click', function () {   //event listener for the close button to close the modal
    savedModal.style.display = 'none';
  })
});

