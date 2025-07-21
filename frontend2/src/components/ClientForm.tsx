import { useState } from "react";
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
import type { Client } from "../types/projectTypes";
import { FaX } from "react-icons/fa6";


const input = mergeStyles({
  border: "1px solid #909090",
  outline: "none",
  padding: "4px",
  fontSize: "14px",
  borderRadius: "5px",
  width: '100%',
  transition: "border 0.3s ease, border-color 0.3s ease",
  selectors: {
    ":hover": {
      border: "1px solid",
      borderColor: "rgb(65, 150, 230)",
    },
  },
});

export const ClientForm = ({
  refreshLIst,
  handleClose,
}: {
  refreshLIst: () => void;
  handleClose: () => void;
}) => {
  const [error, setError] = useState(null);

  const clientSchema = Yup.object().shape({
    type: Yup.string().required("Type is required"),
    businessName: Yup.string().trim().required("Business name is required"),
    address: Yup.object().shape({
      building: Yup.string().required("Building is required"),
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      pinCode: Yup.string().required("Pin Code is required"),
      country: Yup.string().required("Country is required"),
    }),
  });
  const validationSchema = Yup.object().shape({
    clients: Yup.array().of(clientSchema),
  });
  return (
    <div>
      <Formik
        initialValues={{
          clients: [
            {
              type: "",
              businessName: "",
              address: {
                building: "",
                street: "",
                city: "",
                state: "",
                pinCode: "",
                country: "",
              },
            },
          ] as Client[],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            await Promise.all(
              values.clients.map((client) =>
                axiosInstance.post("/Client/create", client)
              )
            )
              .then(() => {
                refreshLIst();
                handleClose();
              })
              .catch((error) => {
                setError(error.response.data);
              });
          } catch (error) {
            console.error("Error creating clients:", error);
          }
        }}
      >
        {({ values }) => (
          <Form>
            <FieldArray name="clients">
              {({ insert, remove }) => (
                <div>
                  {values.clients.map((_, index) => (
                    <Stack
                      key={index}
                      styles={{root: {width: '100%'}}}
                    >
                      <Stack horizontal styles={{root: {width: '100%'}}} horizontalAlign="space-between" verticalAlign="center">
                        <Stack
                        styles={{root: {width: '35%'}}}
                        >
                          <Text>Type</Text>
                          <Field
                            className={input}
                            as="select"
                            name={`clients[${index}].type`}
                          >
                            <option value="">Select Type</option>
                            <option value="Individual">Individual</option>
                            <option value="Limited">Limited</option>
                            <option value="LLP">LLP</option>
                            <option value="Partnership">Partnership</option>
                            <option value="LimitedPartnership">
                              Limited Partnership
                            </option>
                          </Field>
                          <ErrorMessage
                            name={`clients[${index}].type`}
                            component="div"
                            className="error"
                          />
                        </Stack>

                        <Stack
                          styles={{root: {width: '55%'}}}
                        >
                          <Text>Business Name</Text>
                          <Field
                            className={input}
                            name={`clients[${index}].businessName`}
                            placeholder="Business Name"
                          />
                          <ErrorMessage
                            name={`clients[${index}].businessName`}
                            component="div"
                            className="error"
                          />
                        </Stack>
                        <Stack
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "16px",
                          }}
                        >
                          {values.clients.length > 1 && (
                            <Text
                              onClick={() => remove(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <FaTrash color="rgb(247, 75, 75)" />
                            </Text>
                          )}

                          {index === values.clients.length - 1 && (
                            <Text
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                insert(index + 1, {
                                  type: "",
                                  businessName: "",
                                  address: {
                                    building: "",
                                    street: "",
                                    city: "",
                                    state: "",
                                    pinCode: "",
                                    country: "",
                                  },
                                })
                              }
                            >
                              <FaPlus size={18} color="rgb(47, 131, 228)" />
                            </Text>
                          )}
                        </Stack>
                      </Stack>

                      <Stack style={{ marginTop: "19px" }} styles={{root: {width: '100%'}}}>
                        <Stack
                          horizontal
                          horizontalAlign="space-between"
                          tokens={{ childrenGap: 10 }}
                          styles={{
                            root: { marginTop: "10px", width: "100%" },
                          }}
                        >
                          <Stack styles={{
                            root: {width: "50%" },
                          }}>
                            <Field
                              className={input}
                              name={`clients[${index}].address.building`}
                              placeholder="Building"
                            />
                            <ErrorMessage
                              name={`clients[${index}].address.building`}
                              component="div"
                              className="error"
                            />
                          </Stack>
                          <Stack styles={{
                            root: {width: "50%" },
                          }}>
                            <Field
                              className={input}
                              name={`clients[${index}].address.street`}
                              placeholder="Street"
                            />
                            <ErrorMessage
                              name={`clients[${index}].address.street`}
                              component="div"
                              className="error"
                            />
                          </Stack>
                        </Stack>
                        <Stack
                          horizontal
                          horizontalAlign="space-between"
                          tokens={{ childrenGap: 10 }}
                          styles={{
                            root: { marginTop: "10px", width: "100%" },
                          }}
                        >
                          <Stack styles={{
                            root: {width: "50%" },
                          }}>
                            <Field
                              className={input}
                              name={`clients[${index}].address.city`}
                              placeholder="City"
                            />
                            <ErrorMessage
                              name={`clients[${index}].address.city`}
                              component="div"
                              className="error"
                            />
                          </Stack>
                          <Stack styles={{
                            root: {width: "50%" },
                          }}>
                            <Field
                              className={input}
                              name={`clients[${index}].address.state`}
                              placeholder="State"
                            />
                            <ErrorMessage
                              name={`clients[${index}].address.state`}
                              component="div"
                              className="error"
                            />
                          </Stack>
                        </Stack>
                        <Stack
                          horizontal
                          horizontalAlign="space-between"
                          tokens={{ childrenGap: 10 }}
                          styles={{
                            root: { marginTop: "10px", width: "100%" },
                          }}
                        >
                          <Stack styles={{
                            root: {width: "50%" },
                          }}>
                            <Field
                              className={input}
                              name={`clients[${index}].address.pinCode`}
                              placeholder="Pin Code"
                            />
                            <ErrorMessage
                              name={`clients[${index}].address.pinCode`}
                              component="div"
                              className="error"
                            />
                          </Stack>
                          <Stack styles={{
                            root: {width: "50%" },
                          }}>
                            <Field
                              className={input}
                              name={`clients[${index}].address.country`}
                              placeholder="Country"
                            />
                            <ErrorMessage
                              name={`clients[${index}].address.country`}
                              component="div"
                              className="error"
                            />
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>
                  ))}
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
                    {" "}
                    <FaSave /> Save{" "}
                  </button>
                </div>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ClientForm;
