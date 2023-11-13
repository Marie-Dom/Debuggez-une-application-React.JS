import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);

  const getData = useCallback(async () => {
    try {
      const jsonData = await api.loadData();
      setData(jsonData);
      if (Array.isArray(jsonData.events) && jsonData.events.length > 0) {
        setLast(jsonData.events[jsonData.events.length - 1]);
      }
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (!data) {
      getData();
    }
  }, [data]);

  const contextValue = useMemo(
    () => ({ data, error, last }),
    [data, error, last]
  );
  // Vérifie si data n'est pas null avant de fournir les données
  if (data === null) {
    return <div>Loading...</div>;
  }

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
