import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useAppStore } from "../Stores/useAppStore"

export default function Header() {

    const [searchFilters, setSearchFilters] = useState({
        ingredient: '',
        category: ''
    })
    const {pathname} = useLocation()
    const isHome = useMemo(() => pathname === '/' , [pathname])

    const fetchCategories = useAppStore((state) => state.fetchCategories)
    const categories = useAppStore((state) => state.categories)
    const searchRecipes = useAppStore((state) => state.searchRecipes)

    useEffect(() => {
        fetchCategories()
    }, [])
   
    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setSearchFilters({
            ...searchFilters,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        //Validar
        if(Object.values(searchFilters).includes('')) {
            console.log('Todos los campos son obligatorios');    
            return
        }
        // Consultar las recetas
        searchRecipes(searchFilters)
    }
    
  return (
    <header className={isHome ? 'bg-header bg-center bg-cover' : 'bg-slate-800'}>
        <div className="mx-auto container px-5 py-16">
            <div className="flex justify-between items-center">
                <div>
                    <img className="w-32" src="/logo.svg" alt="Logotipo" />
                </div>

                <nav className="flex gap-4">
                    <NavLink 
                        className={({isActive}) => 
                            isActive ? 'text-orange-500 uppercase font-bold' : 'text-white uppercase font-bold'
                        }
                        to='/'>Inicio</NavLink>
                    <NavLink 
                        className={({isActive}) => 
                            isActive ? 'text-orange-500 uppercase font-bold' : 'text-white uppercase font-bold'
                        }
                        to='/favoritos'>Favoritos</NavLink>
                </nav>
            </div>
            {isHome && (
                <form 
                onSubmit={handleSubmit}
                className="md:1/2 2xl:w-1/3 bg-orange-400 my-32 p-10 rounded-lg shadow space-y-6">
                    <div className="space-y-4">
                        <label htmlFor="ingredient"
                        className="block text-white uppercase font-extrabold text-lg"
                        >Nombres o Ingredientes</label>
                        <input 
                            id="ingredient"
                            type="text" 
                            name="ingredient"
                            className="p-3 w-full rounded-lg focus:outline-none"
                            placeholder="Nombre o  Ingrediente. Ej. Vodka, Tequila, Cafe"
                            onChange={handleChange}
                            value={searchFilters.ingredient}
                        />
                    </div>

                    <div className="space-y-4">
                        <label htmlFor="category"
                        className="block text-white uppercase font-extrabold text-lg"
                        >Categoria</label>

                        <select 
                            id="category"
                            name="category"
                            className="p-3 w-full rounded-lg focus:outline-none"
                            onChange={handleChange}
                            value={searchFilters.category}
                        >
                          <option value="">-- Seleccione --</option>
                          {categories.drinks.map(category => (
                            <option 
                            value={category.strCategory}
                            key={category.strCategory}
                            >{category.strCategory}</option>
                          ))}
                        </select>
                    </div>
                    <input 
                        type="submit" 
                        value='Buscar recetas'
                        className="cursor-pointer bg-orange-800 hover:bg-orange-900 text-white font-extrabold w-full p-2 rounded-lg uppercase"
                        />
                </form>
            )}
        </div>
    </header>
  )
}
