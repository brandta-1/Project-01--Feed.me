// const app_key = '7bbbe81cbe8b6c0236aed02fad02e1dc';
// const app_id = 'ebc0f8c5';

// this worked https://api.edamam.com/api/recipes/v2?type=public&q=chicken%2C%20rice%2C%20garlic&app_id=ebc0f8c5&app_key=7bbbe81cbe8b6c0236aed02fad02e1dc 
let apiURL = "";

$(function () {

  $(document).on('keydown', function (e) {
    if (e.keyCode == 13) {
      return false;
    }
  });


  let searchTypes = ["input", "input", "select", "select"];
  let activeSettings = [];

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

  let test = new URLSearchParams(queryParams).toString();

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
      /*
      currSel.append(
        $("<option>")
      );
      */
      dDsettings[currEl.attr("id")].forEach((_, i) => {
        currSel.append(
          $("<option>").attr("id", dDsettings[currEl.attr("id")][i]).text(dDsettings[currEl.attr("id")][i]),
        );
      })

      //set certain dropdowns to multiple
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
      let currInput = $(".search-option").toArray()[i];

      queryParams[currInput.id] = currInput.value;
    })

    //filter null values
    let queryParamsF = Object.fromEntries(Object.entries(queryParams).filter(([_, i]) => i != null && i != [] && i != ""));
    console.log(queryParamsF);
    console.log(queryParamsF.length);
    //create URLSearchParams, make it a string for string methods
    test = new URLSearchParams(queryParamsF).toString();

    // regex used to replace parts of the string that seemed to be causing errors, this may need more work
    test = test.replace(/%2C/g, "&");
    apiURL = "https://api.edamam.com/api/recipes/v2?type=public&" + test;

    //the api url is ready
    DrawResults(apiURL);
  }


  //Leo can start here, just copy paste whatever you had into here:
  //write api output to json file
  async function DrawResults(apiURL) {
    console.log("Draw Results Test:")
    console.log(apiURL);

    let apiObject = await processURL(apiURL);

    $('.controlgroup').empty()
    console.log("wrapper void function test:")
    console.log(apiObject)


    var recipeArray = apiObject.hits
    console.log(recipeArray);
    console.log(recipeArray.length);
    if (recipeArray.length === 0) {
      $('.controlgroup').append(
        $('<h2>').text("No recipes found, try again")
      )
    }

    $('#result-lim').val() > 0 ? resultLimit = $('#result-lim').val() : resultLimit = recipeArray.length


    console.log(resultLimit)
    for (let i = 0; i < resultLimit; i++) {
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
      var instrutionsbutton = $('<button>')
      // make the instructionsbutton variable a for loop!
      instrutionsbutton[i]
      // make controlgroup append child 'instrutionsbutton'
      $('.controlgroup').append(instrutionsbutton)
      // make <a> elements
      var instrutionslink = $('<a>')
      // add attribute href to the link element which contrains the same as recipe url inside the api!
      instrutionslink.attr('href', recipeArray[i].recipe.url);
      // add instrutionslink text content!
      instrutionslink.text('Instructions');
      // make instrutionsbutton append child 'instrutionslink'
      $(instrutionsbutton).append(instrutionslink)
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


});

