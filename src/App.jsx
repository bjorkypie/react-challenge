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
// refactored a bit of the syntax, so the filtering function is a little cleaner. Regular expressions might be quicker than using the filter method, but I like how legible this is.


// BONUS TO DO:
// Refactor to make UI more reusable elsewhere in app
// I would separate out the sorted data table into a component, so that I could filter by name or any other relevant piece of data. The props passed in in the instances of the component would indicate which data to filter or sort by. Depending on the sensitivity of the data, and levels of login access, there may be state playing into this sorted data table component as well.

// AND IF THERE'S STILL TIME...
// How can you improve the UI? How can you get that sorting arrow looking right?

// I edited the app's css to vertically align all material-ui svg icons. If I had more components or instances of this component, there may be a better way to go about this.

// I aligned the table text to the left, as that is more legible in my opinion.

// If there is more than one type of filter available, I would show the filters being implemented to the user in a DOM element which can be removed by pressing an 'x'.



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
    return !!filter ? 
      filteredData.filter(d => 
        d.name.first.toLowerCase().includes(filter.toLowerCase()) 
        || d.name.last.toLowerCase().includes(filter.toLowerCase()))
      : filteredData
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
    filteredData?.sort((a, b) => {
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
