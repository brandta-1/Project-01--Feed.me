var submitbutton = $('#submitbutton')

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
    
    let recipesnames = $('<h2>').text(recipeArray[i].recipe.label);
    $('.controlgroup').append(recipesnames);
    let image = $('<img>').attr('src', recipeArray[i].recipe.image);
    $('.controlgroup').append(image);
    let calories = $('<p>').text(recipeArray[i].recipe.calories)
    calories.text().toString()
    var formatedcalories = calories.text().split('', 3).join('');
    console.log(calories)
    calories = $('<p>').text('Calories: ' + formatedcalories)
    $('.controlgroup').append(calories)
    var instrutionsbutton = $('<button>')
    instrutionsbutton[i]
    $('.controlgroup').append(instrutionsbutton)
    var instrutionslink = $('<a>')
    instrutionslink.attr('href', recipeArray[i].recipe.url);
    instrutionslink.text('instrutions Link!');
    $(instrutionsbutton).append(instrutionslink)
    var savebutton = $('<button>')
    savebutton.text('Save Button')
    savebutton[i]
    $('.controlgroup').append(savebutton)
    savebutton.on('click', function () {
        var pushes = JSON.parse(localStorage.getItem('savedlink')) || [];
        pushes.push(recipeArray[i].recipe.url);
        localStorage.setItem('savedlink', JSON.stringify(pushes));
    });


}
