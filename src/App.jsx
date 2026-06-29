import { useState } from "react"
import'./App.css'

const API_KEY = "ad3c4aea"

function App() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedMovie, setSelectedMovie] = useState(null)

  async function handleSearch() {
    if (!query) return
    setLoading(true)
    setError("")
    setMovies([])

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
      )

      const data = await response.json()

      if (data.Response === "True") {
        setMovies(data.Search)
      } else {
        setError("No movies found.")
      }
    } catch (err) {
      setError("something went wrong.")
    }
    
    setLoading(false)
  }

  async function handleMovieClick(imdbID) {
    if (selectedMovie?.imdbID === imdbID) {
      setSelectedMovie(null)
      return
    }
    const response = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
    )
    const data = await response.json()
    setSelectedMovie(data)
  }

  return (
    <div className="app">
      <h1>Movie Search App</h1>
      <div className="search-bar">
      <input
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
       type="text"
       placeholder="Search for a movie..."
       value={query}
       onChange={(e) => setQuery(e.target.value)}/>
       <button onClick={handleSearch}>Search</button></div>

       {loading && <p>Loading...</p>}
       {error && <p className="error">{error}</p>}

       <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card"
          onClick={() => handleMovieClick(movie.imdbID)}>
            <img src={movie.Poster} alt={movie.imdbID}/>
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
            {selectedMovie?.imdbID === movie.imdbID && (
              <div className="movie-details">
                <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
                <p><strong>Rating:</strong> {selectedMovie.imdbRating}</p>
                <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
                </div>
            )}
          
            </div>
        ))}
       </div>
    </div>
  )
}

export default App
