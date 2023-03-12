// select the button with the id of 'submitbutton'
var submitbutton = $('#submitbutton')

// if submit button is clicked.........
submitbutton.on('click', function (event) {

    var app_key = '78ed9ecf46213fbb084b2a2bffcbee03'
    var app_id = '5f03a793'
    var food = $('#ingredients').val()


    var edamaUrl = 'https://api.edamam.com/search?app_id=' + app_id + '&app_key=' + app_key + '&q=' + food;


    fetch(edamaUrl)
        .then(request => request.json())
        .then(data => {
            console.log(data)
            localStorage.setItem('testrecipes', JSON.stringify(data))

        });
});

const data = JSON.parse(localStorage.getItem('testrecipes'))

var recipeArray = data.hits
// for loop which limit is 5!
for (let i = 0; i < 5; i++) {
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
    instrutionslink.text('instrutions Link!');
    // make instrutionsbutton append child 'instrutionslink'
    $(instrutionsbutton).append(instrutionslink)
    // make a button element
    var savebutton = $('<button>')
    // make button text content!
    savebutton.text('Save Button')
    // make button a for loop
    savebutton[i]
    // .countrolgruop append child 'savebutton'
    $('.controlgroup').append(savebutton)
    // when save button is clicked.......
    savebutton.on('click', function () {
        // make localstorage 'savedlink' an object
        var pushes = JSON.parse(localStorage.getItem('savedlink')) || [];
        // push recipes url content inside the localstorage
        pushes.push(recipeArray[i].recipe.url);
        // creates a localstorage 'savelink' and sets it as a string!
        localStorage.setItem('savedlink', JSON.stringify(pushes));
    });


}
