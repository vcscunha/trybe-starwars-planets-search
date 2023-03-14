import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import PlanetsContext from './PlanetsContext';

export default function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [backupPlanets, setBackupPlanets] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [columnFilter, setColumnFilter] = useState('population');
  const [comparisonFilter, setComparisonFilter] = useState('maior que');
  const [valueFilter, setValueFilter] = useState(0);

  const fetchPlanets = async () => {
    const URL = 'https://swapi.dev/api/planets';

    const response = await fetch(URL);
    const data = await response.json();
    data.results.map((result) => delete result.residents);

    setPlanets(data.results);
    setColumnTitles(Object.keys(data.results[0]));
    setBackupPlanets(data.results);
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  const handleFilterChange = ({ target: { id, value } }) => {
    if (id === 'name-filter') setNameFilter(value);
    if (id === 'value-filter') setValueFilter(value);
  };

  const handleColumnFilterChange = ({ target: { options, selectedIndex } }) => {
    const valueOpt = options[selectedIndex].value;
    setColumnFilter(valueOpt);
  };

  const handleComparisonFilterChange = ({ target: { options, selectedIndex } }) => {
    const valueOpt = options[selectedIndex].value;
    setComparisonFilter(valueOpt);
  };

  const applyNewFilter = (array) => {
    const newArray = array.filter((element) => {
      if (comparisonFilter === 'maior que') {
        return Number(element[columnFilter]) > Number(valueFilter);
      }
      if (comparisonFilter === 'menor que') {
        return Number(element[columnFilter]) < Number(valueFilter);
      }
      return Number(element[columnFilter]) === Number(valueFilter);
    });
    setPlanets(newArray);
  };

  const handleFilterBtnClick = () => {
    applyNewFilter(planets);
  };

  const providedObject = {
    backupPlanets, // não acho que será necessário enviá-lo
    columnFilter,
    columnTitles,
    comparisonFilter,
    nameFilter,
    planets,
    valueFilter,
    handleColumnFilterChange,
    handleComparisonFilterChange,
    handleFilterBtnClick,
    handleFilterChange,
  };

  return (
    <PlanetsContext.Provider value={ providedObject }>
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
