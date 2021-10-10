import {useState, useEffect} from "react"
import axios from "axios"
import './App.css';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// api docs: https://randomuser.me/documentation

// TO DO:
// Implement sorting by date
// using Date.parse() to compare and sort when rows are rendered
// Refactor filtering

// BONUS TO DO:
// Refactor to make UI more reusable elsewhere in app

// AND IF THERE'S STILL TIME...
// How can you improve the UI? How can you get that sorting arrow looking right?

function App() {
  const [filter, setFilter] = useState()
  const [sortDirection, setSortDirection] = useState("asc")
  const [data, setData] = useState()
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    axios.get(`https://randomuser.me/api/?results=50`)
      .then(response => response.data)
      .then(d => {
        const {results} = d
        setData(results)
      })
      .catch(error => console.log(error))
  }, [])

  const filterData = (data) => {
    let filteredData = data
    if (!!filter){
      filteredData = filteredData.filter(d => d.name.first.toLowerCase().includes(filter.toLowerCase()) || d.name.last.toLowerCase().includes(filter.toLowerCase()))
    }
    console.log(Date.parse(filteredData[0].registered.date))
    return  filteredData
  }

  useEffect(() => {
    const filtered = filterData(data)
    setFilteredData(filtered)
  }, [data, filter])

  const renderSortingIcon = () => {
    if (sortDirection === "asc") return <ArrowDownwardIcon fontSize={"small"}/>
    if (sortDirection === "desc") return <ArrowUpwardIcon fontSize={"small"}/>
    return null
  }

  const renderRows = () => {
    const rows = []
    filteredData.sort((a, b) => {
      return sortDirection === 'asc' ? 
        Date.parse(a.registered.date) - Date.parse(b.registered.date) 
        : Date.parse(b.registered.date) - Date.parse(a.registered.date)
    })
    for (let i = 0; i < filteredData?.length; i++){
      rows.push(
        <tr>
          <td>{filteredData[i].name.first} {filteredData[i].name.last}</td>
          <td>{filteredData[i].login.username}</td>
          <td>{filteredData[i].registered.date}</td>
        </tr>
      )
    }
    return rows
  }

  return (
    <div className="App">
      <h1>User info</h1>
      <div>
        <label>Search by name:</label>
        <input type="text" id="search" name="search" onChange={e => setFilter(e.target.value)}/>
      </div>
      <span>
        {!filteredData && (
          !filter ? ("Error") : ("No results")
        )}
      </span>
      <table>
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Username
            </th>
            <th>
              Registration Date
              <span
                onClick={() => {
                  const newDirection = sortDirection === "asc" ? "desc" : "asc"
                  setSortDirection(newDirection)
                }}
              >
              {renderSortingIcon()}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </table>
    </div>
  );
}

export default App;
