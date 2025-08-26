const astrosUrl = 'astros.json'
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
const peopleList = document.getElementById('people')
const btn = document.querySelector('button')

// Handle all fetch requests
const getPeopleInSpace = async (url) => {
  const peopleResponse = await fetch(url)
  const peopleJSON = await peopleResponse.json()

  //map over people
  const profiles = peopleJSON.people.map(async (person) => {
    const perName = person.name
    const craft = person.craft
    const wikiUrlFinal = person.wiki ? person.wiki : person.name

    const profileResponse = await fetch(
      wikiUrl + encodeURIComponent(wikiUrlFinal)
    )
    const profileJSON = await profileResponse.json()

    return { ...profileJSON, craft, perName }
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

btn.addEventListener('click', async (e) => {
  e.target.textContent = 'Loading...'

  const astros = await getPeopleInSpace(astrosUrl)
  generateHTML(astros)

  e.target.remove()
})
