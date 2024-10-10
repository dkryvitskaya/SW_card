import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Функция для генерации случайного ID персонажа от 1 до 85
const getRandomId = () => Math.floor(Math.random() * 85) + 1;

const CharacterCard = () => {
  // Состояния для хранения
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState('');
  const [species, setSpecies] = useState('');
  const [homeworld, setHomeworld] = useState('');
  
  // Хуки для навигации и доступа к URL
  const navigate = useNavigate();
  const location = useLocation();

  // Функция для получения ID персонажа из URL
  const getIdFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('id');
  };

  // Асинхронная функция для получения данных о персонаже по его ID
  const fetchCharacter = async (id) => {
    // Сброс сообщения об ошибке перед новым запросом
    setError('');
    try {
      // Отправляем запрос к API для получения данных о персонаже
      const response = await fetch(`https://swapi.dev/api/people/${id}/`);
      if (!response.ok) {
        throw new Error('Character not found'); // Выбрасываем ошибку, если персонаж не найден
      }
      const data = await response.json(); // Преобразуем ответ в JSON
      setCharacter(data); // Сохраняем данные о персонаже в состоянии
      navigate(`?id=${id}`); // Обновляем URL с новым ID

      // Получаем данные о виде персонажа
      if (data.species.length > 0) {
        const speciesResponse = await fetch(data.species[0]); 
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData.name); 
      } else {
        setSpecies('—'); 
      }

      // Получаем данные о родной планете персонажа
      const homeworldResponse = await fetch(data.homeworld); 
      const homeworldData = await homeworldResponse.json();
      setHomeworld(homeworldData.name); 

    } catch (error) {
      // Обрабатываем ошибку, если запрос не удался
      setError('Failed to load character data. Try again.'); // Устанавливаем сообщение об ошибке
      setCharacter(null); // Сбрасываем состояние персонажа
      setSpecies('—'); // Устанавливаем значение по умолчанию 
      setHomeworld('—'); 
    }
  };

  // Хук useEffect для загрузки данных о персонаже при первом рендере
  useEffect(() => {
    const idFromUrl = getIdFromUrl(); // Получаем ID из URL
    const initialId = idFromUrl ? idFromUrl : 1; // Если ID нет, загружаем первого персонажа
    fetchCharacter(initialId); // Загружаем данные о персонаже
  }, []);

  // Функция для загрузки случайного персонажа
  const handleLoadRandomCharacter = () => {
    const randomId = getRandomId(); // Генерируем случайный ID
    fetchCharacter(randomId); // Загружаем данные о случайном персонаже
  };

  return (
    <div className="character-card">
      {error && <div className="error">{error}</div>} {/* Отображаем сообщение об ошибке, если есть */}
      {character ? ( // Проверяем, загружены ли данные о персонаже
        <div class="container">
          <img
            className="character-image"
            src={`https://starwars-visualguide.com/assets/img/characters/${getIdFromUrl()}.jpg`}
            alt={character.name}
            // Обработка ошибки загрузки изображения
            onError={(e) => (e.target.src = 'https://via.placeholder.com/400x500?text=No+Image')}
          />
          <div className="character-details">
            <h1>{character.name}</h1>
            <p><strong>Birth Year:</strong> {character.birth_year ? character.birth_year : '—'}</p>
            <p><strong>Species:</strong> {species}</p>
            <p><strong>Height:</strong> {character.height ? character.height : '—'}</p>
            <p><strong>Mass:</strong> {character.mass ? character.mass : '—'}</p>
            <p><strong>Gender:</strong> {character.gender ? character.gender : '—'}</p>
            <p><strong>Hair Color:</strong> {character.hair_color ? character.hair_color : '—'}</p>
            <p><strong>Eye Color:</strong> {character.eye_color ? character.eye_color : '—'}</p>
            <p><strong>Skin Color:</strong> {character.skin_color ? character.skin_color : '—'}</p>
            <p><strong>Homeworld:</strong> {homeworld}</p>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {}
      <button className="load-character-btn" onClick={handleLoadRandomCharacter}>
        Load another character
      </button>
    </div>
  );
};

export default CharacterCard;
