import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./styles/Pokemon.css"
import "../components/pokedex/styles/PokemonCard.css"

const Pokemon = () => {
  const [pokemon, setPokemon] = useState()

  const {id} = useParams()

  useEffect(() => {
    const URL = `https://pokeapi.co/api/v2/pokemon/${id}/`
    axios
    .get(URL)
    .then((res) => setPokemon(res.data))
    .catch((err) => console.log(err))
  }, [])

  return (
    <main className='pokemon'>
      <section>
        {/* Parte superior */}
        <section className={`pokemon__img-background bg-lg-${pokemon?.types[0].type.name}`}>
          <div className='pokemon__img'>
            <img
              src={pokemon?.sprites.other["official-artwork"].front_default}
              alt=""
            />
          </div>
        </section>
      </section>

      {/* Body */}
      <section className='pokemon__body'>
        <h2 className='pokemon__body-id'># {pokemon?.id}</h2>
        <h2 className='pokemon__body-name'>{pokemon?.name}</h2>
        <div className='pokemon__body__content-w-h'>
          <div className='pokemon__body-weight'>
            <h5>Weight</h5>
            <h4>{pokemon?.weight}</h4>
          </div>
          <div className='pokemon__body-height'>
            <h5>Height</h5>
            <h4>{pokemon?.height}</h4>
          </div>
        </div>
        <div className='pokemon__body__content-t-a'>
          <div className='pokemon__body-type'>
            <h3>Type</h3>
            <div className='pokemon__body-type-details'>
              {pokemon?.types.map((type) => (
                <div key={type.type.name}>
                  <span>{type.type.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className='pokemon__body-abilities'>
            <h3>Abilities</h3>
            <div className='pokemon__body-abilities-details'>
              {pokemon?.abilities.map((ability) => (
                <div key={ability.ability.name}>
                  <span>{ability.ability.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <section className='pokemon__body__stats'>
          <h2 className='pokemon__body__stats-title'>Stats</h2>
          <section>
            {pokemon?.stats.map((stat) => (
              <article className='pokemon__body__stats-details' key={stat.stat.name}>
                <div className='pokemon__body__stats-details-info'>
                  <h4 className='pokemon__body__stats-details-info-name'>{stat.stat.name}</h4>
                  <h5 className='pokemon__body__stats-details-info-stat'>{stat.base_stat}/150</h5>
                </div>
                {/* <div>
                  <div>
                    <div></div>
                  </div>
                </div> */}
              </article>
            ))}
          </section>
        </section>
      </section>
    </main>
  );
}

export default Pokemon
