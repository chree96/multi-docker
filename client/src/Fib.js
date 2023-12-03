import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  useEffect(() => {
    fetchValues();
    fetchIndexes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSeenIndexes = useMemo(
    () => seenIndexes.map(({ number }) => number).join(", "),
    [seenIndexes]
  );

  const renderValues = useMemo(() => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }, [values]);

  const fetchValues = useCallback(async () => {
    const newValues = await axios.get("/api/values/current");
    setValues(newValues.data);
  }, []);

  const fetchIndexes = useCallback(async () => {
    const newSeenIndexes = await axios.get("/api/values/all");
    setSeenIndexes(newSeenIndexes.data);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      await axios.post("/api/values", {
        index,
      });

      setIndex("");
    },
    [index]
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I've seen:</h3>
      {renderSeenIndexes}

      <h3>Calculated values:</h3>
      {renderValues}
    </div>
  );
};

export default Fib;
