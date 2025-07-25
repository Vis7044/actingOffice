import React, { useEffect, useState } from "react";
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
} from "formik";
import { mergeStyles, Stack, Text } from "@fluentui/react";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import * as Yup from "yup";
import { AxiosError } from "axios";
import type { IAddress, IQuote } from "../types/projectTypes";
import { FaX } from "react-icons/fa6";

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
  userId: string;
}

interface IClient {
  id: string;
  name: string;
}

interface Quote extends IQuote {
  vatRate: number;
  amountBeforeVat: number;
  vatAmount: number;
  businessDetails: {
      address: IAddress,
      businessName:string,
      id: string,
      type: string
    }
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
  /* eslint-disable */
  const [users, setUsers] = React.useState<any[]>([]);
  /* eslint-enable */

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<IClient[]>([]);
  const [error, setError] = useState<string | null>();
  const [servicesData, setServices] = useState<IService[]>([]);

  const fetchService = async () => {
    const resp = await axiosInstance.get("/Service/get?IsDeleted=Active");
    setServices(resp.data.data);
  };

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

  const quoteValidationSchema = Yup.object().shape({
    businessName: Yup.string().required("Business name is required"),

    businessIdName: Yup.object().shape({
      id: Yup.string().required("Business ID is required"),
      name: Yup.string().required("Business name is required"),
    }),

    date: Yup.date()
      .required("Date is required"),
      

    firstResponse: Yup.object().shape({
      firstName: Yup.string().required("name is required"),
    }),

    vatRate: Yup.number()
      .typeError("VAT rate must be a number")
      .min(0, "VAT rate must be 0 or more"),

    amountBeforeVat: Yup.number()
      .typeError("Amount before VAT must be a number")
      .min(0, "Amount before VAT must be 0 or more"),

    vatAmount: Yup.number()
      .typeError("VAT amount must be a number")
      .min(0, "VAT amount must be 0 or more"),

    services: Yup.array()
      .of(
        Yup.object().shape({
          serviceName: Yup.string().required("Service name is required"),
          description: Yup.string().required("Description is required"),
          amount: Yup.number()
            .typeError("Amount must be a number")
            .min(0, "Amount must be 0 or more"),
        })
      )
      .min(1, "At least one service is required"),

    totalAmount: Yup.number()
      .typeError("Total amount must be a number")
      .min(0, "Total amount must be 0 or more"),
  });

  return (
    <Stack>
      <Formik
        initialValues={{
          businessName: initialQuoteData?.businessDetails.businessName || "",
          businessIdName: initialQuoteData?.businessDetails? {
            id: initialQuoteData?.businessDetails.id,
            name: initialQuoteData?.businessDetails.businessName
          } : {
            id: "",
            name: "",
          },
          date: initialQuoteData?.date
          ? new Date(initialQuoteData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
          firstResponse: initialQuoteData?.firstResponse || {
            id: "",
            firstName: "",
            lastName: "",
          },
          quoteStatus: initialQuoteData?.quoteStatus || 0,
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
        validationSchema={quoteValidationSchema}
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
            try {
              if (!isEdit) {
                await axiosInstance.post("/Quote/create", {...payload,date: new Date(`${payload.date}`)});
              }
              if (isEdit) {
                await axiosInstance.post(
                  `/Quote/update/${initialQuoteData?.id}`,
                  { ...payload, date: new Date(`${payload.date}`) }
                );
              }

              refreshLIst();
              handleClose();
            } catch (error) {
              const axiosError: AxiosError<unknown, unknown> =
                error as AxiosError;
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
          /* eslint-disable */

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
            /* eslint-enable */

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
                  <Field name="businessName">
                    {({ field, form, meta }) => (
                      <Stack style={{ position: "relative", width: "70%" }}>
                        <input
                          {...field}
                          autoComplete="off"
                          placeholder="Business Name"
                          name="businessName"
                          className={input}
                          onChange={(e) => {
                            const value = e.target.value;
                            setQuery(value); // for suggestions
                            form.setFieldValue("businessName", value); // update value
                            form.setFieldTouched("businessName", true); // ✅ mark as touched
                          }}
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
                                  form.setFieldValue("businessIdName", {
                                    id: s.id,
                                    name: s.name,
                                  });
                                  form.setFieldValue("businessName", s.name);
                                  form.setFieldTouched("businessName", true); 
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

                        {meta.touched && meta.error && (
                          <div className="error-text">{meta.error}</div> 
                        )}
                      </Stack>
                    )}
                  </Field>
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
                        name="firstResponse.firstName"
                        onChange={(e) => {
                          const userId = e.target.value;
                          const selectedUser = users.find(
                            (u) => u.id === userId
                          );
                          if (selectedUser) {
                            setFieldValue("firstResponse", {
                              id: selectedUser.id,
                              firstName: selectedUser.firstName,
                              lastName: selectedUser.lastName,
                            });
                          }
                        }}
                        style={{ width: "150px", marginLeft: "10px" }}
                      >
                        <option>
                          {values.firstResponse.firstName}{" "}
                          {values.firstResponse.lastName}{" "}
                          {!values.firstResponse.firstName && "Select"}
                        </option>
                        {users &&
                          users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.firstName} {user.lastName}
                            </option>
                          ))}
                      </Field>
                      <ErrorMessage
                        name="firstResponse.firstName"
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
                  {({ insert, remove, replace }) => (
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
                                    const selectedIndex = Number(
                                      e.target.value
                                    );
                                    const selectedService =
                                      servicesData[selectedIndex];

                                    replace(index, {
                                      serviceName: selectedService.name,
                                      description: selectedService.description,
                                      amount: selectedService.amount,
                                    });
                                  }}
                                >
                                  <option value="">{values?.services[index].serviceName}{!values?.services[index].serviceName && 'Select'}</option>

                                  {!servicesData?.length && (
                                    <option disabled>Loading...</option>
                                  )}

                                  {servicesData?.map(
                                    (service: IService, i: number) => (
                                      <option key={i} value={i}>
                                        {service.name}
                                      </option>
                                    )
                                  )}
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

                                <Stack
                                  horizontal
                                  verticalAlign="center"
                                  styles={{ root: { width: "34%" } }}
                                >
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
                                  styles={{ root: { width: "35%" } }}
                                >
                                  <Text style={{ paddingRight: "6px" }}>€</Text>
                                  <Field
                                    className={input}
                                    value={vatAmount.toFixed(2)}
                                    readOnly
                                    style={{
                                      backgroundColor: "#f0f0f0",
                                      width: "100%",
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
                                        style={{
                                          position: "absolute",
                                          right: "85px",
                                          bottom: "10px",
                                          color: 'black',
                                          border: "none",
                                          backgroundColor: "rgba(249, 249, 250, 1)",
                                          padding: "4px 8px",
                                          borderRadius: "5px",
                                        }}
                                        onClick={handleClose}
                                      >
                                        {" "}
                                        <FaX size={16} color="grey" /> Cancel{" "}
                                      </button>
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
                  <FaSave />{" "}save
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
