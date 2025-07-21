
import { Formik, Form, Field, ErrorMessage } from "formik";
import { mergeStyles, Stack, Text } from "@fluentui/react";
import axiosInstance from "../utils/axiosInstance";
import * as Yup from "yup";
import { FaSave } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const input = mergeStyles({
  border: "1px solid #909090",
  outline: "none",
  padding: "4px",
  fontSize: "14px",
  color: "rgba(0,0,0,0.9)",
  borderRadius: "5px",
  width: "90%",
  transition: "border 0.3s ease, border-color 0.3s ease",
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

export const ItemForm = ({
  refreshLIst,
  handleClose,
  initialServiceData,
  isEdit,
  itemId
}: {
  refreshLIst: () => void;
  handleClose: () => void;
  initialServiceData?: IService;
  isEdit?: boolean;
  itemId?:string
}) => {
  const validateYupSchema = Yup.object().shape({
    name: Yup.string().trim().required("*Required"),
    description: Yup.string().trim().required("*Required"),
    amount: Yup.number().min(1).required("*Required"),
  });


  return (
    <div>
      <Formik
        initialValues={{
          name: initialServiceData?.name || "",
          description: initialServiceData?.description || "",
          amount: initialServiceData?.amount || 0,
        }}
        validationSchema={validateYupSchema}
        onSubmit={async (values) => {
          try {
            if (!isEdit) {
              const result = await axiosInstance.post(
                `/Service/create`,
                values
              );
              if (result.data) {
                refreshLIst();
                handleClose();
              }
            } else {
              const result = await axiosInstance.post(
                `Service/update/${itemId}`, values
              );
              if (result.data) {
                refreshLIst();
                handleClose();
              }
            }
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {() => (
          <Form>
            <Stack
              horizontal
              horizontalAlign="space-between"
              styles={{ root: { width: "100%" } }}
            >
              <Stack styles={{ root: { width: "60%" } }}>
                <Text>Business Name</Text>
                <Field className={input} name={`name`} placeholder="Name" />
                <ErrorMessage
                  name={`name`}
                  component="div"
                  className="error"
                />
              </Stack>
              <Stack styles={{ root: { width: "60%" } }}>
                <Text>Description</Text>
                <Field
                  className={input}
                  name={`description`}
                  placeholder="Description"
                />
                <ErrorMessage
                  name={`description`}
                  component="div"
                  className="error"
                />
              </Stack>
              <Stack styles={{ root: { width: "60%" } }}>
                <Text>Amount</Text>
                <Field className={input} name={`amount`} placeholder="Amount" />
                <ErrorMessage
                  name={`amount`}
                  component="div"
                  className="error"
                />
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

export default ItemForm;
