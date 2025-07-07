import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Field, useFormikContext } from "formik";
import { mergeStyles } from "@fluentui/react";

interface IClient {
    id: string;
    name: string;
}

const input = mergeStyles({
  border: "1px solid #909090",
  outline: "none",
  padding: "4px",
  fontSize: "14px",
  borderRadius: "5px",
  width: "250px",
  selectors: {
    ":hover": {
      border: "1px solid",
      borderColor: "rgb(65, 150, 230)",
    },
  },
});

export const BusinessAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<IClient[]>([]);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axiosInstance.get(`/Client/search?query=${query}`);
        setSuggestions(res.data);
        console.log("Suggestions fetched:", res.data);  
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300); // debounce 300ms
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div style={{ position: "relative" }}>
      <Field
        name="businessName"
        placeholder="Business Name"
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          setFieldValue("businessName", value);
        }}
        className={input}
        style={{ width: "600px", border: 'none', borderBottom: '1px solid',borderColor: 'gray' }}
      />

      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            zIndex: 10,
            listStyle: "none",
            margin: 0,
            padding: "0",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => {
                setFieldValue("businessName", s.name);
                setSuggestions([]);
              }}
              style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee" }}
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
