import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { SlReload } from "react-icons/sl";
import { CiFilter } from "react-icons/ci";
import { mergeStyles, getTheme} from "@fluentui/react";
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
import { FaX } from "react-icons/fa6";
import axiosInstance from "../utils/axiosInstance";
import { QuoteStatus, Types } from "../utils/enum";
import { LiaDownloadSolid } from "react-icons/lia";

const theme = getTheme();
const sectionStyle = mergeStyles({
  display: "flex",
  alignItems: "center",
  gap: "10px",
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

// const filterData = {
//   businessType: [
//     "LimitedPartnership",
//     "LLp",
//     "Limited",
//     "Individual",
//     "Partnership",
//   ],
// };



export const CommandBarNav = ({
  refreshLIst,
  updateSearch,
  refreshIcon,
  updateFilter,
  updateStatus
}: {
  refreshLIst: () => void;
  updateSearch: (search: string) => void;
  refreshIcon: boolean;
  updateFilter: (filter: { criteria: string; value: string }) => void;
  updateStatus?: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const buttonId = useId("callout-button");
  const [selectedFilter, setSelectedFilter] = useState({
    criteria: "",
    value: "",
  });
  const [status, setStatus] = useState("Active")
  const [activeStatus,setActiveStatus] = useState(false)
  const location = useLocation();
  const [userOptions, setUserOptions] = React.useState<{id:string,name:string}[]>([]);

  const handleDownloadClients = async () => {
  try {
    const response = await axiosInstance.get("/Client/clients/download", {
      responseType: "blob", // Important for file downloads
    });

    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Clients.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
    
  }
};


  return (
    <Stack horizontal verticalAlign="center" horizontalAlign="space-between" styles={{root: {padding: "0px 20px 3px 20px",
  borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}`,paddingBottom: '5px'}}} >
      {/* Left side */}
      <Stack horizontal verticalAlign="center" tokens={{childrenGap: 25}}>
        <Text styles={{root: {cursor: 'pointer'}}}>
          <SideCanvas name="Add business" refreshLIst={refreshLIst} />
        </Text>
        <Stack horizontal verticalAlign="center" styles={{root: {cursor: 'pointer'}}} tokens={{childrenGap: 5}} onClick={refreshLIst}>
          <SlReload className={refreshIcon ? "spin" : ""} />
          <Text>Refresh</Text>
        </Stack>
        <Stack horizontal verticalAlign="center" styles={{root: {cursor: 'pointer'}}} tokens={{childrenGap: 5}}>
          <LiaDownloadSolid />
          <Text onClick={() => handleDownloadClients()}>Download</Text>
        </Stack>
      </Stack>

      {/* Right side */}
      <div className={sectionStyle}>
        <Stack
          horizontal
          verticalAlign="center"
          tokens={{childrenGap: 4}}
          styles={{
            root:{
            color: "black",
            padding: "4px 10px",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "rgba(0,0,0,0.2)",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}}
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
        </Stack>

        
          <Stack
            styles={{root:{
              backgroundColor: "#C7E0F4",
              padding: "3px 8px",
              borderRadius: "20px",
              cursor: "pointer",
            }}}
            id={activeStatus?`${buttonId}`:'abcd'}
              onClick={() => {
                setActiveStatus(true)
                toggleIsCalloutVisible()
              }}
          >
            <Text>
              Status = <span style={{ fontWeight: "bold" }}>{status?status:'Active'}</span>
            </Text>
          </Stack>
        

        <Stack>
          <Stack horizontal verticalAlign="center" styles={{root: {padding: '10px 0'}}} tokens={{childrenGap: 5}}>
            {selectedFilter.criteria !== "" && selectedFilter.value !== "" && (
              <Stack
                horizontal
                verticalAlign="center"
                tokens={{childrenGap: 5}}
                styles={{root:{
                  backgroundColor: "#C7E0F4",
                  padding: "0 8px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  
                }}}
              >
                <Text style={{}}>
                  {selectedFilter.criteria} ={" "}
                  <Text styles={{root:{ fontWeight: "bold"} }}>
                    {selectedFilter.value}
                  </Text>
                </Text>
                <FaX
                  onClick={() => {
                    updateFilter({ criteria: "", value: "" });
                    setSelectedFilter({ criteria: "", value: "" });
                  }}
                  style={{ marginLeft: "4px" }}
                  size={12}
                />
              </Stack>
            )}
            {!window.location.pathname.startsWith("/items") && <Stack
              horizontal
              verticalAlign="center"
              tokens={{childrenGap: 3}}
              styles={{root:{
                backgroundColor: "#C7E0F4",
                padding: "3px 8px",
                borderRadius: "20px",
                cursor: "pointer",
              }}}
              id={!activeStatus ? `${buttonId}`:"abcd"}
              onClick={() => {
                setActiveStatus(false)
                toggleIsCalloutVisible()
              }}
            >
              <CiFilter size={20} color="rgb(7, 84, 250)" />
              <Text>Add Filter</Text>
            </Stack>}
          </Stack>

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
                  status: "Active",
                }}
                onSubmit={() => {}}
              >
                {/* eslint-disable */}
                {(props: FormikProps<any>) => {
                  {/* eslint-enable */}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                  React.useEffect(()=>{
                    async function  fetchUsers () {
                      const resp = await axiosInstance.get('/Auth/get');
                      
                      const users: {id:string,firstName:string,lastName:string}[] = resp.data;

                      // Extract or format the values you want from users
                      const formatted = users.map((u: {id:string,firstName:string,lastName:string}) => {return {id:u.id,name:`${u.firstName} ${u.lastName}`}}); 
                      setUserOptions(formatted);
                    }
                    if (props.values.criteria === "FirstResponse") {
                      fetchUsers();
                    } else {
                      setUserOptions([]);
                    }
                  },[props.values.criteria])
                  return location.pathname.includes("quote") ? (
                    <Form>
                      <Stack style={{}}>
                        {!activeStatus && <><Text>Criteria: </Text>
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
                          <option value="FirstResponse">First Response</option>
                          <option value="QuoteStatus">Quote Status</option>
                        </Field></>}
                        {activeStatus && <><Text>Values: </Text>
                        <Field
                          as="select"
                          name="status"
                          style={{
                            width: "100%",
                            border: "1px solid",
                            borderColor: "rgba(0,0,0,0.3)",
                            borderRadius: "5px",
                            padding: "4px 5px",
                          }}
                        >
                          <option value="All">All</option>
                          <option value="Active" >Active</option>
                          <option value="Inactive">InActive</option>
                        </Field></>}
                      </Stack>
                      {props.values.criteria === "FirstResponse" && userOptions.length>0 && (
                        <Stack styles={{ root: {marginTop: "10px" }}}>
                          <Text>Value: </Text>
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
                            {userOptions.map((val) => {
                              return <option value={val.id}>{val.name}</option>;
                            })}
                          </Field>
                        </Stack>
                      )}
                      {props.values.criteria === "QuoteStatus" && (
                        <Stack styles={{ root: {marginTop: "10px" }}}>
                          <Text>Value: </Text>
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
                            <option value={""}>Select</option>
                            <option value={QuoteStatus.Drafted}>Drafted</option>
                            <option value={QuoteStatus.Accepted}>Accepted</option>
                            <option value={QuoteStatus.Rejected}>Rejected</option>
                            
                          </Field>
                        </Stack>
                      )}
                      <FocusZone
                        handleTabKey={FocusZoneTabbableElements.all}
                        isCircularNavigation
                      >
                        <Stack
                          className={styles.buttons}
                          tokens={{childrenGap: 8}}
                          horizontal
                        >
                          <DefaultButton onClick={toggleIsCalloutVisible}>
                            Cancel
                          </DefaultButton>
                          {!activeStatus && props.values.criteria==="FirstResponse" && <PrimaryButton
                            onClick={() => {
                              updateFilter(props.values);
                              const selectedUser = userOptions.find((u) => u.id == props.values.value);
                              setSelectedFilter({criteria: props.values.criteria, value: selectedUser?.name || ""});
                              toggleIsCalloutVisible();
                            }}
                          >
                            Done
                          </PrimaryButton>}
                          {!activeStatus && props.values.criteria==="QuoteStatus" && <PrimaryButton
                            onClick={() => {
                              updateFilter(props.values);
                              
                              setSelectedFilter({criteria: props.values.criteria, value: props.values.value});
                              toggleIsCalloutVisible();
                            }}
                          >
                            Done
                          </PrimaryButton>}
                          {activeStatus && updateStatus && <PrimaryButton
                            onClick={() => {
                              updateStatus(props.values.status)
                              setStatus(props.values.status)
                              toggleIsCalloutVisible();
                            }}
                          >
                            Done
                          </PrimaryButton>}
                        </Stack>
                      </FocusZone>
                    </Form>
                  ) : (
                    <Form>
                      <Stack style={{}}>
                        {!activeStatus && <><Text>Criteria: </Text>
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
                          <option value="Type">Business Type</option>
                        </Field></>}
                        {activeStatus && <><Text>Values: </Text>
                        <Field
                          as="select"
                          name="status"
                          style={{
                            width: "100%",
                            border: "1px solid",
                            borderColor: "rgba(0,0,0,0.3)",
                            borderRadius: "5px",
                            padding: "4px 5px",
                          }}
                        >
                          <option value="All">All</option>
                          <option value="Active" >Active</option>
                          <option value="Inactive">InActive</option>
                        </Field></>}
                      </Stack>
                      {props.values.criteria !== "" && !activeStatus && (
                        <Stack styles={{ root:{marginTop: "10px"} }}>
                          <Text>Value: </Text>
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
                           
                              <option value={Types.Individual}>Individual</option>;
                              <option value={Types.LLP}>LLp</option>;
                              <option value={Types.Limited}>Limited</option>;
                              <option value={Types.LimitedPartnership}>LimitedPartnership</option>;
                              <option value={Types.Partnership}>Partnership</option>;
                            
                          </Field>
                        </Stack>
                      )}
                      <FocusZone
                        handleTabKey={FocusZoneTabbableElements.all}
                        isCircularNavigation
                      >
                        <Stack
                          className={styles.buttons}
                          
                          tokens={{childrenGap: 8}}
                          horizontal
                        >
                          <DefaultButton onClick={toggleIsCalloutVisible}>
                            Cancel
                          </DefaultButton>
                          {!activeStatus && <PrimaryButton
                            onClick={() => {
                              updateFilter(props.values);
                              setSelectedFilter(props.values);
                              setStatus(props.values.status)
                              toggleIsCalloutVisible();
                            }}
                          >
                            Done
                          </PrimaryButton>}
                          {activeStatus && updateStatus && <PrimaryButton
                            onClick={() => {
                              updateStatus(props.values.status)
                              setStatus(props.values.status)
                              toggleIsCalloutVisible();
                            }}
                          >
                            Done
                          </PrimaryButton>}
                        </Stack>
                      </FocusZone>
                    </Form>
                  );
                }}
              </Formik>
              {/* This FocusZone allows the user to go between buttons with the arrow keys.
              It's not related to or required for FocusTrapCallout's built-in focus trapping. */}
            </FocusTrapCallout>
          ) : null}
        </Stack>
      </div>
    </Stack>
  );
};
