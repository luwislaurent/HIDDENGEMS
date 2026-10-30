(() => {
  const params = new URLSearchParams(window.location.search);
  const allowed = ['all', 'coffee', 'cafe', 'food'];
  const requested = (params.get('category') || 'all').toLowerCase();
  const selected = allowed.includes(requested) ? requested : 'all';
  const selector = document.getElementById('category');
  const search = document.getElementById('search');
  const list = document.getElementById('discover-list');
  const count = document.getElementById('result-count');
  const context = document.getElementById('campaign-context');
  selector.value = selected;

  // A QR code can encode a campaign origin, but does not reveal a visitor's GPS location.
  const origin = (params.get('from') || '').trim().slice(0, 55);
  const origins = {
    lloyd: 'You came from our coffee campaign. Discover a local alternative.',
    gent: 'Explore independent places in Gent.'
  };
  if (origin && origins[origin.toLowerCase()]) {
    context.textContent = origins[origin.toLowerCase()];
    context.hidden = false;
  }

  function render() {
    const category = selector.value;
    const term = search.value.trim().toLocaleLowerCase('nl');
    const matches = places.filter(place => {
      const type = placeCategories[place.name] || 'all';
      const categoryOK = category === 'all' || type === category;
      const textOK = (place.name + ' ' + place.street).toLocaleLowerCase('nl').includes(term);
      return categoryOK && textOK;
    });
    count.textContent = `${matches.length} PLACE${matches.length === 1 ? '' : 'S'} TO DISCOVER`;
    list.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-results';
      empty.textContent = 'No matches yet. Try another category or search.';
      list.append(empty);
      return;
    }
    for (const place of matches) {
      const card = document.createElement('article');
      card.className = 'discover-card';
      const heading = document.createElement('h2');
      heading.textContent = place.name;
      const street = document.createElement('p');
      street.className = 'discover-street';
      street.textContent = place.street + ', Gent';
      const story = document.createElement('p');
      story.textContent = place.description;
      const link = document.createElement('a');
      link.className = 'map-link';
      link.textContent = 'OPEN IN GOOGLE MAPS ↗';
      link.href = 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(place.name + ', ' + place.street + ', Gent, Belgium');
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      card.append(heading, street, story, link);
      list.append(card);
    }
  }
  selector.addEventListener('change', () => {
    const url = new URL(window.location.href);
    if (selector.value === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', selector.value);
    history.replaceState(null, '', url);
    render();
  });
  search.addEventListener('input', render);
  render();
})();
