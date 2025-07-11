import React, { useEffect, useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from "formik";
import { mergeStyles, Stack, Text } from "@fluentui/react";
import axiosInstance from "../utils/axiosInstance";
import * as Yup from "yup";
import { AxiosError } from "axios";

interface IService {
    name: string;
    description: string;
    amount: number;
    userId: string
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

export const ItemForm = ({
  refreshLIst,
  handleClose,
  initialServiceData,
}: {
  refreshLIst: () => void;
  handleClose: () => void;
  initialServiceData?: IService;
}) => {
  const validateYupSchema = Yup.object().shape({
    name: Yup.string().required("Type is required"),
    description: Yup.string().required("Business name is required"),
    amount: Yup.number().required("Enter Amount")
  });

  const [error, setError] = useState(null);
  
  return (
    <div>
      <Formik
        initialValues={{
          name: initialServiceData?.name || "",
          description: initialServiceData?.description || "",
          amount: initialServiceData?.amount || 0
        }}
        validationSchema={validateYupSchema}
        onSubmit={async (values) => {
          try {
            const result = await axiosInstance.post(
              `/Service/create`,
              values
            );
            if (result.data) {
              refreshLIst();
              handleClose();
            }
          } catch (error) {
            
            console.log(error)
          }
        }}
      >
        {({ values }) => (
          <Form>
            <Stack horizontal horizontalAlign="space-between" styles={{root: {width: '100%'}}}>   
              <Stack styles={{root: {width: '60%'}}}>
                <Text>Business Name</Text>
                <Field
                  className={input}
                  name={`name`}
                  placeholder="Name"
                />
                <ErrorMessage
                  name={`name`}
                  component="div"
                  style={{ color: "red" }}
                />
              </Stack>
              <Stack styles={{root: {width: '60%'}}}>
                <Text>Description</Text>
                <Field
                  className={input}
                  name={`description`}
                  placeholder="Description"
                />
                <ErrorMessage
                  name={`description`}
                  component="div"
                  style={{ color: "red" }}
                />
              </Stack>
              <Stack styles={{root: {width: '60%'}}}>
                <Text>Amount</Text>
                <Field
                  className={input}
                  name={`amount`}
                  placeholder="Amount"
                />
                <ErrorMessage
                  name={`amount`}
                  component="div"
                  style={{ color: "red" }}
                />
              </Stack>
            </Stack>
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
