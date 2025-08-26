const astrosUrl = 'astros.json'
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
const peopleList = document.getElementById('people')
const btn = document.querySelector('button')

// Make an AJAX request
const getJSON = (url, callback) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.onload = () => {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText)
      return callback(data)
    }
  }
  xhr.send()
}

// Generate the markup for each profile
const generateHTML = (data) => {
  const section = document.createElement('section')
  peopleList.appendChild(section)
  // Check if request returns a 'standard' page from Wiki
  if (data.type === 'standard') {
    section.innerHTML = `
      <img src="${data.thumbnail.source || 'img/profile.jpg'}" alt="${
      data.title
    }">
      <h2>${data.title}</h2>
      <p>${data.description}</p>
      <p>${data.extract}</p>
    `
  } else {
    section.innerHTML = `
      <img src="img/profile.jpg" alt="ocean clouds seen from space">
      <h2>${data.title}</h2>
      <p>Results unavailable for ${data.title}</p>
      ${data.extract_html || ''}
    `
  }
}

btn.addEventListener('click', () => {
  // Clear previous results
  peopleList.innerHTML = ''

  // Step 1: Get astronaut list from astros.json
  getJSON(astrosUrl, (json) => {
    json.people.forEach((person) => {
      // Step 2: For each astronaut, fetch their Wikipedia summary
      getJSON(wikiUrl + encodeURIComponent(person.name), generateHTML)
    })
  })
})
