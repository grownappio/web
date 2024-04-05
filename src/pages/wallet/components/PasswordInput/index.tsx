import React, { useEffect, useState } from "react";
import Input from "@/components/Input";
import Form from 'rc-field-form'

export type PasswordInputProps = {
  confirmPassword: (value: string) => void;
}

const PasswordInput = (props: PasswordInputProps) => {
  const { confirmPassword } = props;
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useState(true)

  const reg1 = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z]).+$/)
  

  return (
    <div>
      <div className='mt-24 mb-42 text-center opacity-60'>
        For the first time, You need to set up a wallet password
      </div>
      
      <Form
        form={form}
        initialValues={{ psw1: '', psw2: '' }}
        onFinish={() => confirmPassword(form.getFieldValue('psw1'))}
        onFieldsChange={e => setDisabled(e.some(e => e.errors?.length))}
      >
        <Input
          className="mb-42 [&>.error]:text-12"
          label='Create your wallet password'
          placeholder="Enter password"
          name="psw1"
          type='password'
          rules={[{
            async validator(_, v) {
              if (!v || v.length < 6) throw 'The password must be at least 6 characters long.'
              if (!reg1.test(v)) throw 'Password contains at least Letters and numbers.'
            }
          }]}
        />

        <Input
          className="mb-40 [&>.error]:text-12"
          label='Confirm your password'
          placeholder="Confirm your password"
          name="psw2"
          type='password'
          rules={[{
            async validator(_, v) {
              if (v !== form.getFieldValue('psw1')) throw 'The passwords entered twice are inconsistent'
            }
          }]}
        />
      </Form>

      <button className={`btn-primary mb-40 py-14 w-full text-16 font-[600] rounded-8 ${disabled ? 'disabled' : ''}`} onClick={() => form.submit()}>
        Sign in / Sign Up
      </button>
    </div>
  )
}

export default PasswordInput;