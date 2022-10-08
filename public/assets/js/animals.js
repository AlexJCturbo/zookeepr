const $animalForm = document.querySelector('#animals-form');
const $displayArea = document.querySelector('#display-area');

const printResults = resultArr => {
  console.log(resultArr);

  const animalHTML = resultArr.map(({ id, name, personalityTraits, species, diet }) => {
    return `
  <div class="col-12 col-md-5 mb-3">
    <div class="card p-3" data-id=${id}>
      <h4 class="text-primary">${name}</h4>
      <p>Species: ${species.substring(0, 1).toUpperCase() + species.substring(1)}<br/>
      Diet: ${diet.substring(0, 1).toUpperCase() + diet.substring(1)}<br/>
      Personality Traits: ${personalityTraits
        .map(trait => `${trait.substring(0, 1).toUpperCase() + trait.substring(1)}`)
        .join(', ')}</p>
    </div>
  </div>
    `;
  });

  $displayArea.innerHTML = animalHTML.join('');
};

/*
We call the handleGetAnimalsSubmit() function on form submission. This function will
gather all of the form input data and package it as an object to send to the getAnimals()
function as the formData argument. From there, the object formData will be passed
through the Object.entries() method to create query parameters. Because all that work
is done for us, all we have to do is make the request using queryUrl!
*/
const getAnimals = (formData = {}) => {
  let queryUrl = '/api/animals?';

  Object.entries(formData).forEach(([key, value]) => {
    queryUrl += `${key}=${value}&`;
  });

  console.log(queryUrl);

  //Using fetch() to make a GET request
  fetch(queryUrl)
    .then(response => {
    /*when using fetch() we have to check to see if the ok property in the response is
    true or false. This is the part that will check for any HTTP status code the
    signifies an error.*/
    if (!response.ok) {
      return alert('Error: ' + response.statusText);
    }
    /* If everything's okay, we still have to use the .json() method to parse our
    response into readable JSON format.*/
    return response.json();
  })
  .then(animalData => {
    console.log(animalData);
    printResults(animalData);
  });
};

const handleGetAnimalsSubmit = event => {
  event.preventDefault();
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }
  if (diet === undefined) {
    diet = '';
  }

  const personalityTraitArr = [];
  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;

  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraitArr.push(selectedTraits[i].value);
  }

  const personalityTraits = personalityTraitArr.join(',');

  const animalObject = { diet, personalityTraits };

  getAnimals(animalObject);
};

$animalForm.addEventListener('submit', handleGetAnimalsSubmit);

getAnimals();
