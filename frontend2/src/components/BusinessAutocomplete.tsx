import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useFormikContext } from "formik";
import { Stack, TextField, type ITextFieldStyles, mergeStyles, FocusZone, List } from "@fluentui/react";

interface IClient {
  id: string;
  name: string;
}

const suggestionItemClass = mergeStyles({
  padding: "8px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
  selectors: {
    ":hover": {
      backgroundColor: "#f3f2f1",
    },
  },
});

const textFieldStyles: Partial<ITextFieldStyles> = {
  root: { width: 600 },
  field: {
    borderBottom: "1px solid gray",
    borderRadius: 0,
  },
};

export const BusinessAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<IClient[]>([]);
  const { setFieldValue } = useFormikContext<unknown>(); // Adjust type if needed

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axiosInstance.get(`/Client/search?query=${query}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const onSuggestionClick = (name: string) => {
    setFieldValue("businessName", name);
    setQuery(name);
    setSuggestions([]);
  };

  return (
    <Stack styles={{ root: { position: "relative" } }}>
      <TextField
        label=""
        name="businessName"
        placeholder="Business Name"
        styles={textFieldStyles}
        value={query}
        onChange={(e, newValue) => {
          setQuery(newValue || "");
          setFieldValue("businessName", newValue || "");
        }}
      />

      {suggestions.length > 0 && (
        <FocusZone>
          <Stack
            styles={{
              root: {
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #ccc",
                zIndex: 10,
                maxHeight: "150px",
                overflowY: "auto",
              },
            }}
          >
            <List
              items={suggestions}
              onRenderCell={(item: IClient) => (
                <div
                  key={item.id}
                  onClick={() => onSuggestionClick(item.name)}
                  className={suggestionItemClass}
                >
                  {item.name}
                </div>
              )}
            />
          </Stack>
        </FocusZone>
      )}
    </Stack>
  );
};
