import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { mergeStyles } from "@fluentui/react";
import {FaPlus, FaTrash, FaSave} from 'react-icons/fa'
import axiosInstance from "../utils/axiosInstance";

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
        onSubmit={async (values) => {
          values.clients.map(async (client)=> await axiosInstance.post("/Client/create", client))
          
          refreshLIst();
          handleClose()
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
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <label>Business Name</label>
                          <Field
                            className={input}
                            name={`clients[${index}].businessName`}
                            placeholder="Business Name"
                          />
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
                          <Field className={input} name={`clients[${index}].address.building`} placeholder="Building" />
                          <Field className={input} name={`clients[${index}].address.street`} placeholder="Street" />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }} className={firstDiv}>
                          <Field className={input} name={`clients[${index}].address.city`} placeholder="City" />
                          <Field className={input} name={`clients[${index}].address.state`} placeholder="State" />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }} className={firstDiv}>
                          <Field className={input} name={`clients[${index}].address.pinCode`} placeholder="Pin Code" />
                          <Field className={input} name={`clients[${index}].address.country`} placeholder="Country" />
                        </div>
                      </div>

                      
                    </div>
                  ))}
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
