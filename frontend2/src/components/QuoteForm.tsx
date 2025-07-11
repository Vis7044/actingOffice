import React, { useEffect, useState } from "react";
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  useFormikContext,
} from "formik";
import { mergeStyles, Stack, Text } from "@fluentui/react";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import * as Yup from "yup";
import { BusinessAutocomplete } from "./BusinessAutocomplete";
import { AxiosError } from "axios";
import type { IQuote } from "../types/projectTypes";

const input = mergeStyles({
  border: "1px solid ",
  borderColor: "rgba(0,0,0,0.2)",
  outline: "none",
  padding: "4px",
  fontSize: "14px",
  borderRadius: "5px",
  color: "rgba(0,0,0,0.7)",
  width: "150px",
  selectors: {
    ":hover": {
      border: "1px solid",
      borderColor: "rgb(65, 150, 230)",
    },
  },
});

interface IService {
    key: number;
    name: string;
    description: string;
    amount: number;
    userId: string
}


interface IClient {
  id: string;
  name: string;
}

interface Quote extends IQuote {
  vatRate: number;
  amountBeforeVat: number;
  vatAmount: number;
}

export const QuoteForm = ({
  refreshLIst,
  handleClose,
  initialQuoteData,
  isEdit,
}: {
  refreshLIst: () => void;
  handleClose: () => void;
  initialQuoteData?: Quote;
  isEdit: boolean;
}) => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<IClient[]>([]);
  const [error, setError] = useState<string | null>();

  const [servicesData, setServices] = useState<IService[]>([]);

    const fetchService = async () => {
      const resp = await axiosInstance.get('/Service/get');
      setServices(resp.data);
    }

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
    <Stack>
      <Formik
        initialValues={{
          businessName: initialQuoteData?.businessName || "",
          date:
            initialQuoteData?.date || new Date().toISOString().split("T")[0],
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
              if (!isEdit) {
                await axiosInstance.post("/Quote/create", payload);
                console.log("Quote created successfully:", payload);
              }
              if (isEdit) {
                await axiosInstance.put(
                  `/Quote/update/${initialQuoteData?.id}`,
                  payload
                );
                console.log("quote updated successfully");
              }

              refreshLIst();
              handleClose();
            } catch (error) {
              const axiosError: AxiosError<unknown, unknown> =
                error as AxiosError;
              console.log(axiosError.response?.data);
              setError(axiosError.response?.data as string);
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
              <Stack tokens={{ childrenGap: 10 }}>
                <Stack
                  horizontal
                  verticalAlign="center"
                  horizontalAlign="space-between"
                >
                  <Text>Business Name</Text>
                  <Stack style={{ position: "relative", width: "70%" }}>
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
                        width: "100%",
                        border: "none",
                        borderBottom: "1px solid",
                        borderColor: "rgba(0,0,0,0.1)",
                        borderRadius: "0",
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
                  </Stack>
                  <ErrorMessage
                    name="businessName"
                    component="div"
                    className="error-text"
                  />
                </Stack>

                <Stack
                  horizontal
                  tokens={{ childrenGap: 8 }}
                  verticalAlign="center"
                  styles={{
                    root: {
                      width: "100%",
                      position: "relative",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      paddingBottom: "15px",
                    },
                  }}
                >
                  <Stack
                    horizontal
                    verticalAlign="center"
                    styles={{ root: { width: "50%" } }}
                    tokens={{ childrenGap: 5 }}
                  >
                    <Text>Date</Text>
                    <Field className={input} type="date" name="date" />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="error-text"
                    />
                  </Stack>
                  <Stack styles={{ root: { width: "50%" } }}>
                    <Stack
                      horizontal
                      verticalAlign="center"
                      styles={{
                        root: {
                          position: "relative",
                        },
                      }}
                    >
                      <Text>First Response</Text>
                      <Field
                        as="select"
                        className={input}
                        name="firstResponse"
                        style={{ width: "150px", marginLeft: "10px" }}
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
                    </Stack>
                  </Stack>
                </Stack>
                <Stack
                  horizontal
                  verticalAlign="center"
                  horizontalAlign="space-between"
                  styles={{
                    root: {
                      borderBottom: "3px solid",
                      borderColor: "rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Text
                    variant="medium"
                    styles={{ root: { width: "30%", fontWeight: 700 } }}
                  >
                    Service
                  </Text>
                  <Text styles={{ root: { width: "30%", fontWeight: 700 } }}>
                    Description
                  </Text>
                  <Text styles={{ root: { width: "30%", fontWeight: 700 } }}>
                    Amount
                  </Text>
                </Stack>

                <FieldArray name="services">
                  {({ insert, remove, replace}) => (
                    <>
                      {values.services.map((_, index) => (
                        <Stack tokens={{ childrenGap: 10 }} key={index}>
                          <Stack horizontal>
                            <Stack
                              horizontal
                              styles={{
                                root: {
                                  width: "98%",
                                },
                              }}
                              verticalAlign="center"
                            >
                              <Stack
                                horizontal
                                verticalAlign="center"
                                tokens={{ childrenGap: 20 }}
                                styles={{
                                  root: {
                                    width: "100%",
                                    position: "relative",
                                  },
                                }}
                              >
                                <select
                                  className={input}
                                  style={{ width: "30%" }}
                                  name={`services[${index}].serviceName`}
                                  onClick={fetchService} // no need for arrow function if no arguments
                                  onChange={(e) => {
                                    const selectedIndex = Number(e.target.value);
                                    const selectedService = servicesData[selectedIndex];

                                    replace(index, {
                                      serviceName: selectedService.name,
                                      description: selectedService.description,
                                      amount: selectedService.amount,
                                    });
                                  }}
                                >
                                  <option value="">Select</option>

                                  {!servicesData?.length && (
                                    <option disabled>Loading...</option>
                                  )}

                                  {servicesData?.map((service: IService, i: number) => (
                                    <option key={i} value={i}>
                                      {service.name}
                                    </option>
                                  ))}
                                </select>

                                <ErrorMessage
                                  name={`services[${index}].serviceName`}
                                  component="div"
                                  className="error-service-name"
                                />
                                <Field
                                  className={input}
                                  style={{ width: "30%" }}
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
                                  style={{ width: "30%" }}
                                  name={`services[${index}].amount`}
                                  placeholder="Amount"
                                  type="number"
                                />
                                <ErrorMessage
                                  name={`services[${index}].amount`}
                                  component="div"
                                  className="error-service-amount"
                                />
                              </Stack>
                            </Stack>
                            {index > 0 && (
                              <Text onClick={() => remove(index)}>
                                <FaTrash color="red" />
                              </Text>
                            )}
                          </Stack>
                          {index === values.services.length - 1 && (
                            <Stack styles={{ root: { width: "95%" } }}>
                              <Stack
                                horizontal
                                horizontalAlign="space-between"
                                verticalAlign="center"
                              >
                                <Stack>
                                  <Text
                                    styles={{
                                      root: {
                                        cursor: "pointer",
                                        width: "70px",
                                        backgroundColor: "rgb(54, 121, 245)",
                                        color: "white",
                                        padding: "4px 8px",
                                        borderRadius: "5px",
                                      },
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
                                  </Text>
                                </Stack>

                                <Stack horizontal verticalAlign="center" styles={{root: {width: '34%'}}}>
                                  <Text style={{ paddingRight: "6px" }}>€</Text>
                                  <input
                                    className={input}
                                    value={totalBeforeTax.toFixed(2)}
                                    readOnly
                                    style={{
                                      backgroundColor: "#f0f0f0",
                                      width: "100%",
                                    }}
                                  />
                                </Stack>
                              </Stack>

                              <Stack
                                styles={{
                                  root: {
                                    paddingTop: "10px",
                                  },
                                }}
                                horizontal
                                verticalAlign="center"
                                horizontalAlign="end"
                                tokens={{ childrenGap: 5 }}
                              >
                                
                                  <Field
                                    as="select"
                                    className={input}
                                    name="vatRate"
                                    style={{ width: "13%" }}
                                  >
                                    <option value="0">Vat 0%</option>
                                    <option value="20">Vat 20%</option>
                                  </Field>
                                  <Stack
                                    horizontal
                                    verticalAlign="center"
                                    tokens={{ childrenGap: 3 }}
                                    styles={{root: {width:'35%'}}}
                                  >
                                    <Text style={{ paddingRight: "6px" }}>
                                      €
                                    </Text>
                                    <Field
                                      className={input}
                                      value={vatAmount.toFixed(2)}
                                      readOnly
                                      style={{
                                        backgroundColor: "#f0f0f0",
                                        width: '100%'
                                      }}
                                    />
                                  </Stack>
                              </Stack>
                              <Stack
                                horizontal
                                verticalAlign="center"
                                horizontalAlign="end"
                                styles={{
                                  root: {
                                    marginTop: "10px",
                                  },
                                }}
                              >
                                <Text style={{ paddingRight: "6px" }}>€</Text>
                                <Field
                                  className={input}
                                  value={totalWithTax.toFixed(2)}
                                  readOnly
                                  style={{
                                    backgroundColor: "#f0f0f0",
                                    width: "32%",
                                  }}
                                />
                              </Stack>
                            </Stack>
                          )}
                        </Stack>
                      ))}
                    </>
                  )}
                </FieldArray>

                {error && <div style={{ color: "red" }}>{error}</div>}

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
                  <FaSave /> {isEdit ? "Update" : "Submit"}
                </button>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Stack>
  );
};

export default QuoteForm;
