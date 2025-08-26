const astrosUrl = 'astros.json'
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
const peopleList = document.getElementById('people')
const btn = document.querySelector('button')

// Handle all fetch requests
const getJSON = async (url) => {
  try {
    const response = await fetch(url)
    //I keep forgetting to invoke the .json() method
    return await response.json()
  } catch (err) {
    throw err
  }
}

const getPeopleInSpace = async (url) => {
  const peopleJSON = await getJSON(url)

  //map over people
  const profiles = peopleJSON.people.map(async (person) => {
    const perName = person.name
    const craft = person.craft
    const wikiUrlFinal = person.wiki ? person.wiki : person.name

    const profileJSON = await getJSON(
      wikiUrl + encodeURIComponent(wikiUrlFinal)
    )

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

btn.addEventListener('click', (e) => {
  e.target.textContent = 'Loading...'

  getPeopleInSpace(astrosUrl)
    .then(generateHTML)
    .catch((e) => {
      peopleList.innerHTML = '<h3>Something went wrong!</h3>'
      console.error(e)
    })
    .finally(() => e.target.remove())
})
