
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from "formik";
import { mergeStyles, Stack, Text } from "@fluentui/react";
import { FaSave } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import * as Yup from "yup";
import { FaX } from "react-icons/fa6";

interface IAddress {
  building: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

interface Client {
  businessName: string;
  type: string;
  address: IAddress;
}
interface ClientWithId extends Client {
  id: string;
}


const input = mergeStyles({
  border: "1px solid #909090",
  outline: "none",
  padding: "4px",
  fontSize: "14px",
  color: 'rgba(0,0,0,0.9)',
  borderRadius: "5px",
  width: '90%',
  transition: "border 0.3s ease, border-color 0.3s ease",
  selectors: {
    ":hover": {
      border: "1px solid",
      borderColor: "rgb(65, 150, 230)",
    },
  },
});

export const EditClientForm = ({
  refreshLIst,
  handleClose,
  initialClientData,
}: {
  refreshLIst: () => void;
  handleClose: () => void;
  initialClientData: ClientWithId;
}) => {
  const validateYupSchema = Yup.object().shape({
    type: Yup.string().required("Type is required"),
    businessName: Yup.string().required("Business name is required"),
    address: Yup.object().shape({
      building: Yup.string().required("Building is required"),
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      pinCode: Yup.string().required("Pin Code is required"),
      country: Yup.string().required("Country is required"),
    }),
  });


  return (
    <div>
      <Formik
        initialValues={{
          type: initialClientData.type,
          businessName: initialClientData.businessName,
          address: {
            building: initialClientData.address.building,
            street: initialClientData.address.street,
            city: initialClientData.address.city,
            state: initialClientData.address.state,
            pinCode: initialClientData.address.pinCode,
            country: initialClientData.address.country,
          },
        }}
        validationSchema={validateYupSchema}
        onSubmit={async (values) => {
          try {
            const result = await axiosInstance.post(
              `/Client/update/${initialClientData.id}`,
              values
            );
            if (result.data) {
              refreshLIst();
              handleClose();
            }
          } catch (error) {
            console.error("Error creating clients:", error);
          }
        }}
      >
        {() => (
          <Form>
            <Stack horizontal horizontalAlign="space-between" styles={{root: {width: '100%'}}}>
              <Stack styles={{root: {width: '40%'}}}>
                <Text>Type</Text>
                <Field className={input} as="select" name={`type`}>
                  <option value="">Select Type</option>
                  <option value="Individual">Individual</option>
                  <option value="Limited">Limited</option>
                  <option value="LLp">LLP</option>
                  <option value="Partnership">Partnership</option>
                  <option value="LimitedPartnership">
                    Limited Partnership
                  </option>
                </Field>
                <ErrorMessage
                  name={`type`}
                  component="div"
                  className="error"
                />
              </Stack>

              <Stack styles={{root: {width: '60%'}}}>
                <Text>Business Name</Text>
                <Field
                  className={input}
                  name={`businessName`}
                  placeholder="Business Name"
                />
                <ErrorMessage
                  name={`businessName`}
                  component="div"
                  className="error"
                />
              </Stack>
            </Stack>

            <Stack styles={{ root: { marginTop: "19px", width: '100%' } }}>
              <Stack
                horizontal
                horizontalAlign="space-between"
                tokens={{ childrenGap: 10 }}
                styles={{ root: { marginTop: "10px", width: "100%" } }}
              >
                <Stack styles={{ root: {width: "50%" } }}>
                  <Field
                    className={input}
                    name={`address.building`}
                    placeholder="Building"
                  />
                  <ErrorMessage
                    name={`address.building`}
                    component="div"
                    className="error"
                  />
                </Stack>
                <Stack styles={{ root: {width: "50%" } }}>
                  <Field
                    className={input}
                    name={`address.street`}
                    placeholder="Street"
                  />
                  <ErrorMessage
                    name={`address.street`}
                    component="div"
                    className="error"
                  />
                </Stack>
              </Stack>
              <Stack
                horizontal
                horizontalAlign="space-between"
                tokens={{ childrenGap: 10 }}
                styles={{ root: { marginTop: "10px", width: "100%" } }}
              >
                <Stack styles={{ root: {width: "50%" } }}>
                  <Field
                    className={input}
                    name={`address.city`}
                    placeholder="City"
                  />
                  <ErrorMessage
                    name={`address.city`}
                    component="div"
                    className="error"
                  />
                </Stack>
                <Stack styles={{ root: {width: "50%" } }}>
                  <Field
                    className={input}
                    name={`address.state`}
                    placeholder="State"
                  />
                  <ErrorMessage
                    name={`address.state`}
                    component="div"
                    className="error"
                  />
                </Stack>
              </Stack>
              <Stack
                horizontal
                horizontalAlign="space-between"
                tokens={{ childrenGap: 10 }}
                styles={{ root: { marginTop: "10px", width: "100%" } }}
              >
                <Stack styles={{ root: {width: "50%" } }}>
                  <Field
                    className={input}
                    name={`address.pinCode`}
                    placeholder="Pin Code"
                  />
                  <ErrorMessage
                    name={`address.pinCode`}
                    component="div"
                    className="error"
                  />
                </Stack>
                <Stack styles={{ root: {width: "50%" } }}>
                  <Field
                    className={input}
                    name={`address.country`}
                    placeholder="Country"
                  />
                  <ErrorMessage
                    name={`address.country`}
                    component="div"
                    className="error"
                  />
                </Stack>
              </Stack>
            </Stack>

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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditClientForm;
