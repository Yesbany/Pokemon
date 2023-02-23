import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PokemonCard from '../components/pokedex/PokemonCard'
import "./styles/Pokedex.css"
import "./styles/Pagination.css"

const Pokedex = () => {
  const [pokemons, setPokemons] = useState([])
  const [pokemonsFilter, setPokemonsFilter] = useState([])
  const [types, setTypes] = useState([])
  const [selectType, setSelectType] = useState("")
  const [pokemonName, setPokemonName] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const nameTrainer = useSelector(store => store.nameTrainer)

  const handleChangeSelect = (e) => {
    setSelectType(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPokemonName(e.target.pokemonName.value)
  }

  const paginationLogic = () => {
    //Cantidad de pokemons por pagina
    const pokemonPerPage = 12

    //Pokemons que se van a mostrar en la pagina actual
    const sliceStart = (currentPage -1 )* pokemonPerPage
    const sliceEnd = sliceStart + pokemonPerPage
    const pokemonsInPage = pokemonsFilter.slice(sliceStart, sliceEnd)

    //Ultima pagina
    const lastPage = Math.ceil(pokemonsFilter.length / pokemonPerPage) || 1

    //Bloque actual
    const pagesPerBlock = 5
    const actualBlock = Math.ceil(currentPage / pagesPerBlock)

    //Paginas que se van a mostar en el bloque actual
    const pagesInBlock = []
    const minPage = (actualBlock * pagesPerBlock - pagesPerBlock) +1
    const maxPage = actualBlock * pagesPerBlock
    for(let i = minPage; i <= maxPage; i++){
      if(i <= lastPage){
        pagesInBlock.push(i)
      }
    }

    return {pagesInBlock, lastPage, pokemonsInPage}
  }

  const {pagesInBlock, lastPage, pokemonsInPage} = paginationLogic()

  const handleNextPage = () => {
    const newPage = currentPage +1
    if(newPage > lastPage){
      setCurrentPage(1)
    } else{
      setCurrentPage(newPage)
    }
  }

  const handlePreviusPage = () => {
    const newPage = currentPage - 1
    if(newPage < 1){
      setCurrentPage(lastPage)
    }else{
      setCurrentPage(newPage)
    }
  }

  useEffect(() => {
    const URL = `https://pokeapi.co/api/v2/${selectType ? `type/${selectType}/` : "pokemon/?limit=20" }`
    axios.get(URL)
    .then((res) => {
      if(selectType){
        const pokemonByType = res.data.pokemon.map(pokemon => {
          return {
            name: pokemon.pokemon.name,
            url: pokemon.pokemon.url
        }
        })
        setPokemons(pokemonByType)
      }else {
        setPokemons(res.data.results)
      }
    })
    .catch((err) => console.log(err))
  }, [selectType])

  useEffect(() => {
    const pokemonByName = pokemons.filter(pokemon => pokemon.name.includes(pokemonName.toLowerCase()))
    setPokemonsFilter(pokemonByName)
  }, [pokemonName, pokemons])

  useEffect(() => {
    const URL = "https://pokeapi.co/api/v2/type/"
    axios.get(URL)
    .then((res) => setTypes(res.data.results))
    .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [pokemons])

  return (
    <main className='Pokedex'>
      <p><span>Welcome {nameTrainer}</span>, here you can find information about of your favorite pokemon</p>
      <form className='Pokedex__form' onSubmit={handleSubmit}>
        <div className='Pokedex__form-search'>
          <input type="text" id="pokemonName" placeholder='search your pokemon' />
          <button>Search</button>
        </div>
        <select className='Pokedex__form-select' onChange={handleChangeSelect}>
          <option value="">All</option>
          {
            types.map(type => <option key={type.url}>{type.name}</option>)
          }
        </select>
      </form>
      <section className='Pokedex__list'>
        {
          pokemonsInPage.map(pokemon => <PokemonCard key={pokemon.url} pokemonUrl={pokemon.url}/>)
        }
      </section>
      <section className='Pokedex__pagination'>
        <ul className='Pokedex__pagination-list'>
          <li className='Pokedex__pagination-item' onClick={handlePreviusPage} >{"<<"}</li>
          <li className='Pokedex__pagination-item' onClick={() => setCurrentPage(1)} >...</li>
          {
            pagesInBlock.map(page => <li className='Pokedex__pagination-item' onClick={() => setCurrentPage(page)} key={page}>{page}</li>)
          }
          <li className='Pokedex__pagination-item' onClick={() => setCurrentPage(lastPage)}>...</li>
          <li className='Pokedex__pagination-item' onClick={handleNextPage} >{">>"}</li>
        </ul>
      </section>
    </main>
  )
}

export default Pokedex