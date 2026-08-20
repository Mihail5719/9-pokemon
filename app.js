'use strict';

const card = document.getElementById('card');

// 1-й запрос: получаем покемона Ditto
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/ditto');
xhr.send();

xhr.addEventListener('load', function () {
  if (xhr.status !== 200) {
    showError(`Ошибка загрузки покемона: ${xhr.status}`);
    return;
  }

  let pokemon;
  try {
    pokemon = JSON.parse(xhr.responseText);
  } catch (e) {
    showError('Невалидный JSON покемона: ' + e.message);
    return;
  }

  // URL первой способности
  const abilityUrl = pokemon.abilities[0].ability.url;

  // 2-й запрос: получаем детали способности
  const xhr2 = new XMLHttpRequest();
  xhr2.open('GET', abilityUrl);
  xhr2.send();

  xhr2.addEventListener('load', function () {
    if (xhr2.status !== 200) {
      showError(`Ошибка загрузки способности: ${xhr2.status}`);
      return;
    }

    let ability;
    try {
      ability = JSON.parse(xhr2.responseText);
    } catch (e) {
      showError('Невалидный JSON способности: ' + e.message);
      return;
    }

    // Ищем описание на английском
    const enEntry = ability.effect_entries.find(
      (entry) => entry.language.name === 'en',
    );

    if (!enEntry) {
      showError('Описание на английском не найдено');
      return;
    }

    // Обязательный вывод в консоль
    console.log(enEntry.effect);

    // Визуализация на странице
    renderCard(pokemon, ability.name, enEntry.effect);
  });

  xhr2.addEventListener('error', () =>
    showError('Сетевая ошибка при загрузке способности'),
  );
});

xhr.addEventListener('error', () =>
  showError('Сетевая ошибка при загрузке покемона'),
);

// Вспомогательные функции
function showError(message) {
  console.error('Ошибка:', message);
  card.innerHTML = `<p class="error">❌ ${message}</p>`;
}

function renderCard(pokemon, abilityName, description) {
  const sprite =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  card.innerHTML = `
    <div class="pokemon-header">
      <img src="${sprite}" alt="${pokemon.name}">
      <h2>${pokemon.name}</h2>
    </div>
    <div class="ability-name">Ability: ${abilityName}</div>
    <p class="description">${description}</p>
  `;
}
