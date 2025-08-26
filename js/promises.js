const astrosUrl = 'astros.json'
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
const peopleList = document.getElementById('people')
const btn = document.querySelector('button')

//map over all astronauts
const getProfiles = (json) => {
  const profiles = json.people.map((person) => {
    const perName = person.name
    const craft = person.craft
    const wikiUrlFinal = person.wiki ? person.wiki : person.name

    return fetch(wikiUrl + encodeURIComponent(wikiUrlFinal))
      .then((response) => response.json())
      .then((profile) => ({ ...profile, craft, perName }))
      .catch((err) => console.log('Error Fetching Wiki: ', err))
  })
  return Promise.all(profiles)
}

// Generate the markup for each profile
const generateHTML = (data) => {
  data.forEach((person) => {
    const section = document.createElement('section')
    peopleList.appendChild(section)

    if (person.type === 'standard') {
      section.innerHTML = `
        <img src="${person.thumbnail?.source || 'img/profile.jpg'}" alt="${
        person.title
      }">
        <span>${person.craft || ''}</span>
        <h2>${person.perName || person.title}</h2>
        <p>${person.description || ''}</p>
        <p>${person.extract || ''}</p>
      `
    } else {
      section.innerHTML = `
        <img src="img/profile.jpg" alt="ocean clouds seen from space">
        <span>${person.craft || ''}</span>
        <h2>${person.perName || person.title}</h2>
        <p>Results unavailable for ${person.title}</p>
        ${person.extract_html || ''}
      `
    }
  })
}

btn.addEventListener('click', (e) => {
  e.target.textContent = 'Loading...'

  fetch(astrosUrl)
    .then((response) => response.json())
    .then(getProfiles)
    .then(generateHTML)
    .catch((err) => {
      peopleList.innerHTML = '<h3>Something went wrong!</h3>'
      console.log(err)
    })
    .finally(() => e.target.remove())
})
