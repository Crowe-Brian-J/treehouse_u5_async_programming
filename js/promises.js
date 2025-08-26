const astrosUrl = 'astros.json'
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
const peopleList = document.getElementById('people')
const btn = document.querySelector('button')

// Make an AJAX request
const getJSON = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText)
        resolve(data)
      } else {
        reject(Error(xhr.statusText))
      }
    }
    xhr.onerror = () => {
      reject(Error('A network error occurred.'))
    }
    xhr.send()
  })
}

//map over all astronauts
const getProfiles = (json) => {
  const profiles = json.people.map((person) => {
    if (person.wiki) {
      return getJSON(wikiUrl + person.wiki, generateHTML)
    } else {
      return getJSON(wikiUrl + person.name, generateHTML)
    }
  })
  return Promise.all(profiles)
}

// Generate the markup for each profile
const generateHTML = (data) => {
  data.map((person) => {
    const section = document.createElement('section')
    peopleList.appendChild(section)
    // Check if request returns a 'standard' page from Wiki
    if (person.type === 'standard') {
      section.innerHTML = `
      <img src="${person.thumbnail.source || 'img/profile.jpg'}" alt="${
        person.title
      }">
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
    `
    } else {
      section.innerHTML = `
      <img src="img/profile.jpg" alt="ocean clouds seen from space">
      <h2>${person.title}</h2>
      <p>Results unavailable for ${person.title}</p>
      ${person.extract_html || ''}
    `
    }
  })
}

btn.addEventListener('click', (e) => {
  e.target.textContent = 'Loading...'

  getJSON(astrosUrl)
    .then(getProfiles)
    .then(generateHTML)
    .catch((err) => {
      peopleList.innerHTML = '<h3>Something went wrong!</h3>'
      console.log(err)
    })
    .finally(() => e.target.remove())
})
