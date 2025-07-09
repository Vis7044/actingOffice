import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage, useFormikContext } from "formik";
import { mergeStyles } from "@fluentui/react";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import * as Yup from "yup";
import { BusinessAutocomplete } from "./BusinessAutocomplete";
import { AxiosError } from "axios";
import type { IQuote } from "../types/projectTypes";

const firstDiv = mergeStyles({
  display: "flex",
  gap: "10px",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  position: "relative",
  padding: "10px 0",
});

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

interface IClient {
    id: string;
    name: string;
}

interface Quote extends IQuote {
  vatRate: number,
  amountBeforeVat: number
  vatAmount: number
}


export const QuoteForm = ({
  refreshLIst,
  handleClose,
  initialQuoteData,
  isEdit
}: {
  refreshLIst: () => void;
  handleClose: () => void;
  initialQuoteData?: Quote;
  isEdit: boolean
}) => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<IClient[]>([]);
  const [error, setError] = useState<string | null>()
 

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/Auth/get");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array to run only once on mount

  const validationSchema = Yup.object().shape({
    businessName: Yup.string().required("Business Name is required"),
    date: Yup.date().required("Date is required"),
    firstResponse: Yup.string().required(),
    vatRate: Yup.number().required("VAT rate is required"),
    services: Yup.array()
      .of(
        Yup.object().shape({
          serviceName: Yup.string().required("Service name is required"),
          description: Yup.string().required("Description is required"),
          amount: Yup.number()
            .required("Amount is required")
            .min(0, "Amount must be at least 0"),
        })
      )
      .min(1, "At least one service is required"),
  });

  

  return (
    <div>
      <Formik
        initialValues={{
          businessName: initialQuoteData?.businessName || "",
          date: initialQuoteData?.date || new Date().toISOString().split('T')[0],
          firstResponse: initialQuoteData?.firstResponse,
          vatRate: initialQuoteData?.vatRate || "0",
          amountBeforeVat: initialQuoteData?.amountBeforeVat || 0,
          vatAmount: initialQuoteData?.vatAmount || 0,
          services: initialQuoteData?.services || [
            {
              serviceName: "",
              description: "",
              amount: 0,
            },
          ],
          totalAmount: initialQuoteData?.totalAmount || 0,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const totalBeforeTax = values.services.reduce(
              (sum, s) => sum + Number(s.amount),
              0
            );
            const vat = Number(values.vatRate);
            const vatAmount = totalBeforeTax * (vat / 100);
            const totalWithTax = totalBeforeTax + vatAmount;

            const payload = {
              ...values,
              vatRate: vat,
              totalAmount: totalWithTax,
              vatAmount,
              amountBeforeVat: totalBeforeTax,
            };
            console.log("Payload to be sent:", payload);
            try {
              if(!isEdit) {
                await axiosInstance.post("/Quote/create", payload);
              console.log("Quote created successfully:", payload);
              }
              if(isEdit) {
                await axiosInstance.put(`/Quote/update/${initialQuoteData?.id}`, payload)
                console.log("quote updated successfully")
              }
              
              refreshLIst();
              handleClose();
            } catch (error) {
              const axiosError:AxiosError<unknown, unknown> = error as AxiosError;
              console.log(axiosError.response?.data)
              setError(axiosError.response?.data as string)
            }
            
          } catch (error) {
            console.error("Error creating quote:", error);
          }
        }}
      >
        {({ values, setFieldValue }) => {
          // Recalculate total amount whenever services or VAT rate changes
          // This effect will run on initial render and whenever services or vatRate changes
          useEffect(() => {
            const totalBeforeTax = values.services.reduce(
              (sum, s) => sum + Number(s.amount),
              0
            );
            const vat = Number(values.vatRate);
            const vatAmount = totalBeforeTax * (vat / 100);
            const totalWithTax = totalBeforeTax + vatAmount;

            setFieldValue("totalAmount", totalWithTax);
          }, [values.services, values.vatRate, setFieldValue]);

          const totalBeforeTax = values.services.reduce(
            (sum, s) => sum + Number(s.amount),
            0
          );
          const vat = Number(values.vatRate);
          const vatAmount = totalBeforeTax * (vat / 100);
          const totalWithTax = totalBeforeTax + vatAmount;

          return (
            <Form>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: '95%',
                  margin: '0 auto'
                }}
              >
                <div className={firstDiv}>
                  <label>Business Name</label>
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
                      style={{
                        width: "600px",
                        border: "none",
                        borderBottom: "1px solid",
                        borderColor: "rgba(0,0,0,0.1)",
                        borderRadius: '0',
                      }}
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
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {s.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <ErrorMessage
                    name="businessName"
                    component="div"
                    className="error-text"
                  />
                </div>

                <div
                className={firstDiv}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.2)",
                    paddingBottom: "30px",
                  }}
                >
                  <div style={{display: 'flex' , alignItems: 'center', gap: '5px'}}>
                    <label>Date</label>
                    <Field className={input} type="date" name="date" />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="error-text"
                    />
                  </div>
                  <div >
                    <div>
                      <label>First Response</label>
                      <Field
                        as="select"
                        className={input}
                        name="firstResponse"
                        style={{ width: "200px", marginLeft: "10px" }}
                      >
                        <option>Select</option>
                        {users &&
                          users.map((user) => (
                            <option
                              key={user.id}
                              value={`${user.firstName} ${user.lastName}`}
                            >
                              {user.firstName} {user.lastName}
                            </option>
                          ))}
                      </Field>
                      <ErrorMessage
                        name="firstResponse"
                        component="div"
                        className="error-first-response"
                      />
                    </div>
                  </div>
                </div>

                <FieldArray name="services">
                  {({ insert, remove }) => (
                    <>
                      {values.services.map((_, index) => (
                        <div key={index}>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                
                              }}
                            >
                              <div
                                className={firstDiv}
                                style={{
                                  gap: "10px",
                                  alignItems: "center",
                                  paddingTop: "10px",
                                }}
                              >
                                <Field
                                  className={input}
                                  name={`services[${index}].serviceName`}
                                  placeholder="Service Name"
                                />
                                <ErrorMessage
                                  name={`services[${index}].serviceName`}
                                  component="div"
                                  className="error-service-name"
                                />
                                <Field
                                  className={input}
                                  name={`services[${index}].description`}
                                  placeholder="Description"
                                />
                                <ErrorMessage
                                  name={`services[${index}].description`}
                                  component="div"
                                  className="error-service-description"
                                />

                                <Field
                                  className={input}
                                  name={`services[${index}].amount`}
                                  placeholder="Amount"
                                  type="number"
                                />
                                <ErrorMessage
                                  name={`services[${index}].amount`}
                                  component="div"
                                  className="error-service-amount"
                                />
                              </div>
                              {index > 0 && (
                                <span onClick={() => remove(index)}>
                                  <FaTrash color="red" />
                                </span>
                              )}
                            </div>
                            <div style={{ marginTop: "20px" }}></div>
                          </div>
                          {index === values.services.length - 1 && (
                            <span
                              style={{
                                cursor: "pointer",
                                backgroundColor: "rgb(54, 121, 245)",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "5px",
                              }}
                              onClick={() =>
                                insert(index + 1, {
                                  serviceName: "",
                                  description: "",
                                  amount: 0,
                                })
                              }
                            >
                              <FaPlus color="white" /> Add
                            </span>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </FieldArray>

                <div style={{ position: "relative", paddingTop: "20px" }}>
                  <div
                    style={{
                      position: "absolute",
                      right: "0px",
                      marginLeft: "20px",
                    }}
                  >
                    <span style={{ paddingRight: "6px" }}>€</span>
                    <input
                      className={input}
                      value={totalBeforeTax.toFixed(2)}
                      readOnly
                      style={{ backgroundColor: "#f0f0f0", width: "150px" }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "70px",
                      right: "0px",
                      display: "flex",
                      gap: '5px',
                      alignItems: "center",
                    }}
                  >
                    <Field
                      as="select"
                      className={input}
                      name="vatRate"
                      style={{ width: "150px" }}
                    >
                      <option value="0">Vat 0%</option>
                      <option value="20">Vat 20%</option>
                    </Field>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ paddingRight: "6px" }}>€</span>
                      <input
                        className={input}
                        value={vatAmount.toFixed(2)}
                        readOnly
                        style={{ backgroundColor: "#f0f0f0", width: "150px" }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "120px",
                      right: "0px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ paddingRight: "6px" }}>€</span>
                    <input
                      className={input}
                      value={totalWithTax.toFixed(2)}
                      readOnly
                      style={{ backgroundColor: "#f0f0f0", width: "150px" }}
                    />
                  </div>
                </div>
                {error && <div style={{color: 'red'}}>{error}</div>}

                <button
                  type="submit"
                  style={{
                    position: "absolute",
                    right: "5px",
                    bottom: "10px",
                    border: "none",
                    backgroundColor: "rgb(54, 121, 245)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "5px",
                  }}
                >
                  <FaSave /> {isEdit? 'Update': 'Submit'}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default QuoteForm;
