import React, { useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { mergeStyles } from "@fluentui/react";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import * as Yup from "yup";
import { BusinessAutocomplete } from "./BusinessAutocomplete";

const firstDiv = mergeStyles({
  display: "flex",
  gap: "10px",
  justifyContent: "space-evenly",
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

export const QuoteForm = ({
  refreshLIst,
  handleClose,
}: {
  refreshLIst: () => void;
  handleClose: () => void;
}) => {
    const [users, setUsers] = React.useState<any[]>([]);

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
        }
    , []); // Empty dependency array to run only once on mount

    const validationSchema = Yup.object().shape({
  businessName: Yup.string().required("Business Name is required"),
  date: Yup.date().required("Date is required"),
  fristResponse: Yup.string()
  .required("First Response is required")
  .notOneOf([""], "Please select a valid response"),
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
          businessName: "",
          date: new Date().toISOString().substring(0, 10),
          fristResponse: "",
          vatRate: "0", 
          amountBeforeVat: 0,
          vatAmount: 0,
          services: [
            {
              serviceName: "",
              description: "",
              amount: 0,
            },
          ],
          totalAmount: 0,
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
            await axiosInstance.post("/Quote/create", payload);
            console.log("Quote created successfully:", payload);
            refreshLIst();
            handleClose();
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
                }}
              >
                <div className={firstDiv}>
                  <label>Business Name</label>
                  <BusinessAutocomplete />
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
                  <div className={firstDiv}>
                    <label>Date</label>
                    <Field className={input} type="date" name="date" />
                    <ErrorMessage
                    name="date"
                    component="div"
                    className="error-text"
                    />
                  </div>
                  <div className={firstDiv}>
                    <div>
                        <label>First Response</label>
                    <Field
                      as="select"
                      className={input}
                      name="firstResponse"

                      style={{ width: "200px", marginLeft: "10px" }}
                    >
                        <option >Select</option>
                        {users && users.map((user) => (
                          <option key={user.id} value={user.id}>
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
                        <div
                          key={index}
                          
                        >
                        <div>
                        <div style={{ display: "flex", gap: "10px",alignItems: 'center', width: "96%" }}>
                            <div className={firstDiv}
                          style={{
                            gap: "10px",
                            alignItems: "center",
                            paddingTop: "10px",
                          }}>
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
                          <div style={{marginTop: '20px'}}>
                            {index === 0 && (
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
                        </div>
                          
                        </div>
                      ))}
                    </>
                  )}
                </FieldArray>

                <div style={{ position: "relative", paddingTop: "20px" }}>
                  <div
                    style={{
                      position: "absolute",
                      right: "50px",
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
                      right: "50px",
                      display: "flex",
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
                  <div style={{position: 'absolute',top: '120px', right: '50px', display: "flex", alignItems: "center" }}>
                    <span style={{ paddingRight: "6px" }}>€</span>
                    <input
                      className={input}
                      value={totalWithTax.toFixed(2)}
                      readOnly
                      style={{ backgroundColor: "#f0f0f0", width: "150px" }}
                    />
                  </div>
                </div>

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
                  <FaSave /> Submit
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
