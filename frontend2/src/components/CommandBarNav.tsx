import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { SlReload } from "react-icons/sl";
import { CiFilter } from "react-icons/ci";
import { mergeStyles, getTheme } from "@fluentui/react";
import SideCanvas from "./SideCanvas";
import * as React from "react";
import {
  mergeStyleSets,
  FocusTrapCallout,
  FocusZone,
  FocusZoneTabbableElements,
  FontWeights,
  Stack,
  Text,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { Field, Form, Formik, type FormikProps } from "formik";
import { useLocation } from "react-router-dom";

const theme = getTheme();

const commandBarStyle = mergeStyles({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0px 20px 3px 20px",
  borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
});

const sectionStyle = mergeStyles({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const itemStyle = mergeStyles({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
  selectors: {
    ":hover": {
      backgroundColor: theme.palette.neutralLight,
    },
  },
});

const filterStyle = mergeStyles({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "3px 7px",
  backgroundColor: "#C7E0F4",
  cursor: "pointer",
  borderRadius: "40px",
  selectors: {
    ":hover": {
      backgroundColor: "#B3D0E8",
    },
  },
});

const styles = mergeStyleSets({
  callout: {
    width: 320,
    padding: "20px 24px",
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semibold,
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
  },
});

const filterData = {
  
    businessType: ['LimitedPartnership','LLp','Limited','Individual','Partnership']
  
}

export const CommandBarNav = ({
  refreshLIst,
  updateSearch,
  refreshIcon,
  updateFilter
}: {
  refreshLIst: () => void;
  updateSearch: (search: string) => void;
  refreshIcon: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const buttonId = useId("callout-button");
  const location = useLocation();

  return (
    <div className={commandBarStyle}>
      {/* Left side */}
      <div className={sectionStyle}>
        <div className={itemStyle}>
          <SideCanvas name="Add business" refreshLIst={refreshLIst} />
        </div>
        <div className={itemStyle} onClick={refreshLIst}>
          <SlReload className={refreshIcon ? "spin" : ""} />
          <span>Refresh</span>
        </div>
      </div>

      {/* Right side */}
      <div className={sectionStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "black",
            padding: "4px 10px",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "rgba(0,0,0,0.2)",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <FaSearch color="gray" />
          <input
            placeholder="Search"
            style={{ border: "none", outline: "none" }}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value === "") {
                updateSearch("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateSearch(searchTerm);
            }}
          />
        </div>

       {location.pathname.includes("client") && (
         <div
          style={{
            backgroundColor: "#C7E0F4",
            padding: "3px 8px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          <span>
            Status = <span style={{ fontWeight: "bold" }}>Active</span>
          </span>
        </div>
        )}
        <div id={buttonId} onClick={() => toggleIsCalloutVisible()}>
          <div
            style={{
              backgroundColor: "#C7E0F4",
              padding: "3px 8px",
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            <CiFilter size={20} color="rgb(7, 84, 250)" />
            <span>Add Filter</span>
          </div>

          {isCalloutVisible ? (
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#${buttonId}`}
              onDismiss={toggleIsCalloutVisible}
              setInitialFocus
            >
              <Text block variant="xLarge" className={styles.title}>
                select filter
              </Text>
              <Formik
                initialValues={{
                  criteria: "",
                  value: "",
                }}
                onSubmit={(values) => {
                  updateFilter(values);
                  refreshLIst();
                  
                }}
              >
                {(props: FormikProps<any>) => {
                  console.log(props.values);
                  return (
                    <Form>
                      <div style={{}}>
                        <div>Criteria: </div>
                        <Field
                          as="select"
                          name="criteria"
                          style={{
                            width: "100%",
                            border: "1px solid",
                            borderColor: "rgba(0,0,0,0.3)",
                            borderRadius: "5px",
                            padding: "4px 5px",
                          }}
                        >
                          <option value={""}>Select Category</option>
                          <option value="businessType">Business Type</option>
                          <option value="green">Green</option>
                          <option value="blue">Blue</option>
                        </Field>
                      </div>
                      {props.values.criteria !== "" && (
                        <div style={{ marginTop: "10px" }}>
                          <div>Value: </div>
                          <Field
                            as="select"
                            name="value"
                            style={{
                              width: "100%",
                              border: "1px solid",
                              borderColor: "rgba(0,0,0,0.3)",
                              borderRadius: "5px",
                              padding: "4px 5px",
                            }}
                          >
                            <option value={""}>Select Value</option>
                            {filterData.businessType.map(val => {
                              return <option value={val}>{val}</option>
                            })}
                          </Field>
                        </div>
                      )}
                    </Form>
                  );
                }}
              </Formik>
              {/* This FocusZone allows the user to go between buttons with the arrow keys.
              It's not related to or required for FocusTrapCallout's built-in focus trapping. */}
              <FocusZone
                handleTabKey={FocusZoneTabbableElements.all}
                isCircularNavigation
              >
                <Stack
                  className={styles.buttons}
                  // eslint-disable-next-line @typescript-eslint/no-deprecated
                  gap={8}
                  horizontal
                >
                  <DefaultButton onClick={toggleIsCalloutVisible}>
                    Cancel
                  </DefaultButton>
                  <PrimaryButton onClick={toggleIsCalloutVisible}>
                    Done
                  </PrimaryButton>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          ) : null}
        </div>
      </div>
    </div>
  );
};
