import { useEffect, createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import './App.css';
interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}


function usePokemonSource():{
pokemon: Pokemon[],
search: string,
setSearch: (search: string)=> void
}
{
    const [ {pokemon, search}, dispatch]=useReducer((state: PokemonState, action:PokemonAction)=>{
        switch(action.type){
            case "setPokemon":
                return {...state, pokemon:action.payload}
            case "setSearch":
                return {...state, search: action.payload}
        }
      },{
        pokemon:[],
        search:""
      })
    type PokemonState = {
        pokemon: Pokemon[],
        search: string
    }
    type PokemonAction = |{ type: "setPokemon"; payload: Pokemon[] } | { type: "setSearch"; payload: string };

    const filteredPokemon = useMemo(
        ()=> pokemon.filter((p)=>p.name.toLocaleLowerCase().includes(search)),[pokemon, search]).slice(0,20)

  
    const sortedPokemon = useMemo(()=>
        [...filteredPokemon].sort((a,b)=>a.name.localeCompare(b.name))
        ,[filteredPokemon])

  const setSearch = useCallback((search: string)=>{
    dispatch({
        type: "setSearch",
        payload: search
    })
  },[])



  useEffect(()=>{
    fetch("/pokemon.json")
    .then((response)=>response.json())
    .then((data)=>dispatch({
        type: "setPokemon",
        payload:data
    }))
  },[])
  return {pokemon:sortedPokemon, search, setSearch}
}

const PokemonContext = createContext<
ReturnType<typeof usePokemonSource> | undefined
>(undefined)

export function usePokemon(){
  return useContext(PokemonContext)!
}

export function PokemonProvider({children}:{
    children: React.ReactNode
}){
    return (
        <PokemonContext.Provider value={usePokemonSource()}>
        {children}
      </PokemonContext.Provider>
    )
}
