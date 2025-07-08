import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage, validateYupSchema } from "formik";
import { mergeStyles } from "@fluentui/react";
import {FaPlus, FaTrash, FaSave} from 'react-icons/fa'
import axiosInstance from "../utils/axiosInstance";
import * as Yup from 'yup';

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

const firstDiv = mergeStyles({
  display: 'flex',
  gap: '10px',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  width: '100%',
});

const input = mergeStyles({
  border: "1px solid #909090",
  outline: "none",
  padding: "4px",
  fontSize: "14px",
  borderRadius: "5px",
  width: '250px',
  transition: 'border 0.3s ease, border-color 0.3s ease',
  selectors: {
    ':hover': {
      border: '1px solid',
      borderColor: 'rgb(65, 150, 230)'
    }
  }
});

export const ClientForm = ({refreshLIst, handleClose}: {refreshLIst: () => void, handleClose : () => void}) => {
  const clientSchema = Yup.object().shape({
  type: Yup.string().required('Type is required'),
  businessName: Yup.string().required('Business name is required'),
  address: Yup.object().shape({
    building: Yup.string().required('Building is required'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pinCode: Yup.string().required('Pin Code is required'),
    country: Yup.string().required('Country is required'),
    }),
  });

  const [error,setError] = useState(null)
  
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
                building: '',
                street: '',
                city: '',
                state: '',
                pinCode: '',
                country: ''
              }
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
            ).then(()=>{
              refreshLIst();  
              handleClose();  
            })
            .catch(error => {
              setError(error.response.data)
            })

          
        } catch (error) {
          console.error("Error creating clients:", error);
        }
      }}

      >
        {({ values }) => (
          <Form>
            <FieldArray name="clients">
              {({ insert, remove, push }) => (
                <div>
                  {values.clients.map((client, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <div className={firstDiv}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <label>Type</label>
                          <Field className={input} as="select" name={`clients[${index}].type`}>
                            <option value="">Select Type</option>
                            <option value="Individual">Individual</option>
                            <option value="Limited">Limited</option>
                            <option value="LLP">LLP</option>
                            <option value="Partnership">Partnership</option>
                            <option value="LimitedPartnership">Limited Partnership</option>
                          </Field>
                          <ErrorMessage name={`clients[${index}].type`} component="div" style={{color: 'red'}}/>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <label>Business Name</label>
                          <Field
                            className={input}
                            name={`clients[${index}].businessName`}
                            placeholder="Business Name"
                          />
                          <ErrorMessage name={`clients[${index}].businessName`} component="div" style={{color: 'red'}}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
                        
                          {index > 0 && (
                            <span
                              onClick={() => remove(index)}
                              style={{cursor: 'pointer'}}
                            >
                              <FaTrash color="red"/>
                            </span>
                            
                          )}
                          <span
                          style={{cursor: 'pointer'}}
                            onClick={() =>
                              insert(index + 1, {
                                type: "",
                                businessName: "",
                                address: {
                                  building: '',
                                  street: '',
                                  city: '',
                                  state: '',
                                  pinCode: '',
                                  country: ''
                                }
                              })
                            }
                          >
                            <FaPlus color="blue"/>
                          </span>
                      </div>
                        
                      </div>

                      <div style={{marginTop: '8px'}}>
                        <div style={{ display: 'flex', gap: '10px' }} className={firstDiv}>
                          <div>
                            <Field className={input} name={`clients[${index}].address.building`} placeholder="Building" />   
                          <ErrorMessage name={`clients[${index}].address.building`} component="div" style={{color: 'red'}}/>       
                            </div>            
                          <div>
                            <Field className={input} name={`clients[${index}].address.street`} placeholder="Street" />  
                          <ErrorMessage name={`clients[${index}].address.street`} component="div" style={{color: 'red'}}/>      
                            </div>               
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }} className={firstDiv}>
                          <div>
                            <Field className={input} name={`clients[${index}].address.city`} placeholder="City" />
                          <ErrorMessage name={`clients[${index}].address.city`} component="div" style={{color: 'red'}}/>
                          </div>
                          <div>
                            <Field className={input} name={`clients[${index}].address.state`} placeholder="State" />  
                          <ErrorMessage name={`clients[${index}].address.state`} component="div" style={{color: 'red'}}/>     
                            </div>                  
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }} className={firstDiv}>
                          <div>
                            <Field className={input} name={`clients[${index}].address.pinCode`} placeholder="Pin Code" />
                          <ErrorMessage name={`clients[${index}].address.pinCode`} component="div" style={{color: 'red'}}/>
                          </div>
                          <div>
                            <Field className={input} name={`clients[${index}].address.country`} placeholder="Country" />
                          <ErrorMessage name={`clients[${index}].address.country`} component="div" style={{color: 'red'}}/> 
                          </div>

                        </div>
                      </div>

                      
                    </div>
                  ))}
                  {error && <div style={{color: 'red'}}>{error}</div>}
                  <button type="submit" style={{position: 'absolute', right: '5px', bottom: '10px', border: 'none', backgroundColor: 'rgb(54, 121, 245)', color: 'white',padding: '4px 8px', borderRadius: '5px'}}> <FaSave/> Submit </button>
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
